function load(outer, inner) {
    document.getElementById("outerCode").value = outer;
    document.getElementById("innerCode").value = inner;
    save();
}

function loadPython() {
    const outer = `
import sys
from io import StringIO
import unittest

def resolve():
    pass

class TestClass(unittest.TestCase):
{{ METHOD }}
    def assertIO(self, input, expected):
        stdout, stdin = sys.stdout, sys.stdin
        sys.stdout, sys.stdin = StringIO(), StringIO(input)
        resolve()
        sys.stdout.seek(0)
        actual = sys.stdout.read()[:-1]
        sys.stdout, sys.stdin = stdout, stdin
        self.assertEqual(expected, actual)

if __name__ == "__main__":
    resolve()
`.replace(/^\n/g, "");

    const inner = `
    def test_{{ NAME }}(self):
        input = """{{ INPUT }}"""
        expected = """{{ OUTPUT }}"""
        self.assertIO(input, expected)
`.replace(/^\n/g, "");

    load(outer, inner);
}

function loadJava() {
    const outer = `
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

public class MainTest {
{{ METHOD }}
    private void assertIO(String input, String output) throws Exception {
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

        assertIO(input, output);
    }
`.replace(/^\n/g, "");

    load(outer, inner);
}

function loadKotlin() {
    const outer = `
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.PrintStream

class MainTest {
{{ METHOD }}
    private fun assertIO(input: String, output: String) {
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

        assertIO(input, output)
    }
`.replace(/^\n/g, "");

    load(outer, inner);
}

function loadCSharp() {
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
        private void AssertIO(string input, string output)
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

            AssertIO(input, output);
        }
`.replace(/^\n/g, "");

    load(outer, inner);
}

function save() {
    chrome.storage.sync.set({
        outer: document.getElementById("outerCode").value,
        inner: document.getElementById("innerCode").value
    });
    console.debug("Saved.")
}

function copy(e) {
    navigator.clipboard.writeText(e.target.textContent);
    e.preventDefault();

    const tooltip = bootstrap.Tooltip.getOrCreateInstance(e.target);
    tooltip.show();
    setTimeout(() => tooltip.hide(), 1500);
}

async function initialize() {
    document.querySelectorAll('[data-i18n]').forEach(e => {
        e.innerHTML = chrome.i18n.getMessage(e.dataset.i18n);
    });

    chrome.storage.sync.get(null, function (items) {
        if (items.language !== undefined) {
            // upgrade from v1
            switch (items.language) {
                case "Java":
                    loadJava();
                    break;
                case "Kotlin":
                    loadKotlin();
                    break;
                case "CSharp":
                    loadCSharp();
                    break;
                case "Python3":
                    loadPython();
                    break;
            }

            chrome.storage.sync.remove("language");
            document.getElementById("release").click();
        } else if (items.outer === undefined || items.inner === undefined) {
            loadPython();
            document.getElementById("tutorial").click();
        } else {
            load(items.outer, items.inner);
        }
    });

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
}

document.addEventListener('DOMContentLoaded', initialize);
