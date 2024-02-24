function load(outer, inner) {
    document.getElementById("outerCode").value = outer;
    document.getElementById("innerCode").value = inner;
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
import static org.hamcrest.CoreMatchers.is;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

import org.junit.Assert;
import org.junit.Test;

public class MainTest {
{{ METHOD }}
    private void assertIO(String input, String output) throws Exception {
        ByteArrayInputStream in = new ByteArrayInputStream(input.getBytes());
        System.setIn(in);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));

        Main.main(new String[0]);

        Assert.assertThat(out.toString(), is(output + System.lineSeparator()));
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
import org.hamcrest.CoreMatchers.equalTo
import org.junit.Assert
import org.junit.Test
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

        Assert.assertThat(sysOut.toString(), equalTo(output + System.lineSeparator()))
    }
}
`.replace(/^\n/g, "");

    const inner = `
    @Test
    fun {{ NAME }}() {
        String input = """
{{ INPUT }}""";
        String output = """
{{ OUTPUT }}""";

        assertIO(input, output);
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

function initialize() {

}

document.addEventListener('DOMContentLoaded', initialize);