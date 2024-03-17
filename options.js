async function load(outer, inner) {
    document.getElementById("outerCode").value = outer;
    document.getElementById("innerCode").value = inner;
    await save();
}

async function loadPython() {
    const outer = `
import sys
import os
from io import StringIO
import unittest

def resolve():
    pass

class TestClass(unittest.TestCase):
{{ METHOD }}
    def judge(self, input, expected):
        stdout, stdin = sys.stdout, sys.stdin
        sys.stdout, sys.stdin = StringIO(), StringIO(input)
        resolve()
        sys.stdout.seek(0)
        actual = sys.stdout.read()[:-1]
        sys.stdout, sys.stdin = stdout, stdin
        self.assertEqual(expected, actual)

if __name__ == "__main__":
    if "ATCODER" in os.environ:
        resolve()
    else:
        unittest.main(verbosity=2)
`.replace(/^\n/g, "");

    const inner = `
    def test_{{ NAME }}(self):
        input = """{{ INPUT }}"""
        expected = """{{ OUTPUT }}"""
        self.judge(input, expected)
`.replace(/^\n/g, "");

    await load(outer, inner);
}

async function loadJava() {
    const outer = `
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

public class MainTest {
{{ METHOD }}
    private void judge(String input, String output) throws Exception {
        ByteArrayInputStream in = new ByteArrayInputStream(input.getBytes());
        System.setIn(in);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));

        Main.main(new String[0]);

        Assertions.assertEquals(output + System.lineSeparator(), out.toString());
    }
}
`.replace(/^\n/g, "");

    const inner = `
    @Test
    public void {{ NAME }}() throws Exception {
        String input = """
{{ INPUT }}""";
        String output = """
{{ OUTPUT }}""";

        judge(input, output);
    }
`.replace(/^\n/g, "");

    await load(outer, inner);
}

async function loadKotlin() {
    const outer = `
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.PrintStream

class MainTest {
{{ METHOD }}
    private fun judge(input: String, output: String) {
        val sysIn = ByteArrayInputStream(input.toByteArray())
        System.setIn(sysIn)

        val sysOut = ByteArrayOutputStream()
        System.setOut(PrintStream(sysOut))

        main()

        Assertions.assertEquals(output + System.lineSeparator(), sysOut.toString())
    }
}
`.replace(/^\n/g, "");

    const inner = `
    @Test
    fun {{ NAME }}() {
        val input = """
{{ INPUT }}""".trimMargin()
        val output = """
{{ OUTPUT }}""".trimMargin()

        judge(input, output)
    }
`.replace(/^\n/g, "");

    await load(outer, inner);
}

async function loadCSharp() {
    const outer = `
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.IO;

namespace AtCoder
{
    [TestClass]
    public class ProgramTest
    {
{{ METHOD }}
        private void Judge(string input, string output)
        {
            StringReader reader = new StringReader(input);
            Console.SetIn(reader);

            StringWriter writer = new StringWriter();
            Console.SetOut(writer);

            Program.Main(new string[0]);

            Assert.AreEqual(output + Environment.NewLine, writer.ToString());
        }
    }
}
`.replace(/^\n/g, "");

    const inner = `
        [TestMethod]
        public void {{ NAME }}()
        {
            string input =
@"{{ INPUT }}";
            string output =
@"{{ OUTPUT }}";

            Judge(input, output);
        }
`.replace(/^\n/g, "");

    await load(outer, inner);
}

async function save() {
    await chrome.storage.sync.set({
        outer: document.getElementById("outerCode").value,
        inner: document.getElementById("innerCode").value
    });
    console.debug("Saved.")
}

async function copy(e) {
    await navigator.clipboard.writeText(e.target.textContent);
    e.preventDefault();

    const tooltip = bootstrap.Tooltip.getOrCreateInstance(e.target);
    tooltip.show();
    setTimeout(() => tooltip.hide(), 1500);
}

async function initialize() {
    document.querySelectorAll('[data-i18n]').forEach(e => {
        e.innerHTML = chrome.i18n.getMessage(e.dataset.i18n);
    });
    if (chrome.i18n.getUILanguage() == "ja") {
        document.querySelectorAll('[data-i18n-lang="ja"]').forEach(e => e.classList.remove("d-none"))
    } else {
        document.querySelectorAll('[data-i18n-lang="en"]').forEach(e => e.classList.remove("d-none"))
    }

    const setTheme = function () {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-bs-theme', 'dark')
        } else {
            document.documentElement.setAttribute('data-bs-theme', 'light')
        }
    };
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);
    setTheme();

    document.getElementById("loadPython").addEventListener("click", loadPython);
    document.getElementById("loadJava").addEventListener("click", loadJava);
    document.getElementById("loadKotlin").addEventListener("click", loadKotlin);
    document.getElementById("loadCSharp").addEventListener("click", loadCSharp);
    document.getElementById("outerCode").addEventListener("change", save);
    document.getElementById("innerCode").addEventListener("change", save);
    Array.from(document.getElementsByClassName("mustache")).forEach(e => e.addEventListener("click", copy));

    const isMajorOrMinorUpdate = function (prev, current) {
        // v1.2.3 => {major: 1, minor: 2, patch: 3}
        const [prevMajor, prevMinor] = prev.split(",").map(v => parseInt(v));
        const [major, minor] = current.split(",").map(v => parseInt(v));

        return (prevMajor < major) || (prevMajor == major && prevMinor < minor)
    }

    let updated = false;
    let installed = false;
    const manifest = chrome.runtime.getManifest();
    const items = await chrome.storage.sync.get(null)
    if (items.language !== undefined) {
        // upgrade from v1
        switch (items.language) {
            case "Java":
                await loadJava();
                break;
            case "Kotlin":
                await loadKotlin();
                break;
            case "CSharp":
                await loadCSharp();
                break;
            case "Python3":
                await loadPython();
                break;
        }

        await chrome.storage.sync.remove("language");
        updated = true;
    } else if (items.outer === undefined || items.inner === undefined) {
        await loadPython();
        installed = true;
    } else {
        if (items.version === undefined || isMajorOrMinorUpdate(items.version, manifest.version)) {
            await chrome.storage.sync.set({ "version": manifest.version });
            updated = true;
        }
        await load(items.outer, items.inner);
    }

    const permissions = { "origins": manifest.host_permissions };
    if (!await chrome.permissions.contains(permissions)) {
        const modal = new bootstrap.Modal('#initModal');
        const button = document.getElementById("btnPermission");
        button.addEventListener("click", async (e) => {
            if (await chrome.permissions.request(permissions)) {
                modal.hide();
                document.getElementById("tutorial").click();
            }
        });
        modal.show();
    } else if (updated) {
        document.getElementById("release").click();
    } else if (installed) {
        document.getElementById("tutorial").click();
    }
}

document.addEventListener('DOMContentLoaded', initialize);
