chrome.runtime.onMessage.addListener(function (message, sender, callback) {
  if (message.functiontoInvoke == "onClick") {
    let io = onClick();

    chrome.storage.sync.get({
      language: 'Java',
    }, function (items) {
      switch (items.language) {
        case "Java":
          navigator.clipboard.writeText(createJUnit(io));
          break;
        case "CSharp":
          navigator.clipboard.writeText(createMSTest(io));
          break;
        case "Python3":
          navigator.clipboard.writeText(createPyUnittest(io));
          break;
        case "Kotlin":
          navigator.clipboard.writeText(createJUnitKotlin(io));
          break;
        default:
          throw new Error("Unknown language. [items.language=" + items.language + "]");
      }
    });
  }
});

function onClick() {
  let name = null;
  let input = null;
  let output = null;
  let io = [];

  const sections = document.querySelectorAll("#task-statement section");
  for (const section of sections) {
    let h3 = section.querySelector("h3");
    let pre = section.querySelector("pre");

    // SECTION の中に H3 タグがある場合(ABC033_D)と、
    // SECTION の直前に H3 タグがある場合(ARC014_A)がある
    if (h3 == null) {
      let prev = section.previousElementSibling;
      if (prev != null > 0 && prev.tagName == "H3") {
        h3 = prev;
      }
    }

    if (h3 != null && pre != null && (h3.offsetWidth || h3.offsetHeight)) {
      let header = h3.firstChild.textContent.trim();
      let example = pre.textContent;

      // シンタックスハイライトされている場合、リスト形式に
      // なっているので、一行ずつ取り出す (ABC007_3、など)
      let pretty = pre.getElementsByTagName("li");
      if (pretty.length > 0) {
        example = "";
        for (let j = 0; j < pretty.length; j++) {
          example += pretty[j].textContent;
          example += "\n";
        }
      }

      if (header.indexOf("入力例") == 0 || header.indexOf("Sample Input") == 0) {
        name = header.replace(/\s+/g, "_");
        input = example;
      } else if (header.indexOf("出力例") == 0 || header.indexOf("Sample Output") == 0) {
        output = example;
      }
    }

    if (name != null && input != null && output != null) {
      io.push({ name: name, input: input, output: output });
      name = input = output = null;
    }
  }

  return io;
}

function createJUnit(io) {
  let text =
    `import static org.hamcrest.CoreMatchers.is;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

import org.junit.Assert;
import org.junit.Test;

public class MainTest {
`;

  for (let i = 0; i < io.length; i++) {
    text += `
	@Test
	public void ${io[i].name}() throws Exception {
		String input = 
			"${io[i].input.trim("\n").replace(/\n/g, '" + System.lineSeparator() +\n			"')}";
		String output = 
			"${io[i].output.trim("\n").replace(/\n/g, '" + System.lineSeparator() +\n			"')}";

		assertIO(input, output);
	}
`;
  }

  text += `
	private void assertIO(String input, String output) throws Exception {
		ByteArrayInputStream in = new ByteArrayInputStream(input.getBytes());
		System.setIn(in);

		ByteArrayOutputStream out = new ByteArrayOutputStream();
		System.setOut(new PrintStream(out));

		Main.main(new String[0]);

		Assert.assertThat(out.toString(), is(output + System.lineSeparator()));
	}
}
`;

  return text;
};

function createMSTest(io) {
  let text =
    `using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.IO;

namespace AtCoder
{
    [TestClass]
    public class ProgramTest
    {`;

  for (let i = 0; i < io.length; i++) {
    text += `
        [TestMethod]
        public void ${io[i].name}()
        {
            string input =
@"${io[i].input.trim("\n").replace(/\n/g, '\r\n')}";
            string output =
@"${io[i].output.trim("\n").replace(/\n/g, '\r\n')}";

            AssertIO(input, output);
        }
`;
  }

  text += `
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
`;

  return text;
}

function createPyUnittest(io) {
  let text =
    `import sys
from io import StringIO
import unittest


class TestClass(unittest.TestCase):
    def assertIO(self, input, output):
        stdout, stdin = sys.stdout, sys.stdin
        sys.stdout, sys.stdin = StringIO(), StringIO(input)
        resolve()
        sys.stdout.seek(0)
        out = sys.stdout.read()[:-1]
        sys.stdout, sys.stdin = stdout, stdin
        self.assertEqual(out, output)

`;

  for (let i = 0; i < io.length; i++) {
    text +=
      `    def test_${io[i].name}(self):
        input = """${io[i].input.trim("\n").replace(/\n/g, '\r\n')}"""
        output = """${io[i].output.trim("\n").replace(/\n/g, '\r\n')}"""
        self.assertIO(input, output)

`;
  }

  text += `
if __name__ == "__main__":
    unittest.main()
`;

  return text;
}

function createJUnitKotlin(io) {
  let text =
    `import org.hamcrest.CoreMatchers.equalTo
import org.junit.Assert
import org.junit.Test
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.PrintStream

class MainTest {
`;

  for (let i = 0; i < io.length; i++) {
    text += `
    @Test
    fun ${io[i].name}() {
        val input =
            "${io[i].input.trim("\n").replace(/\n/g, '" + System.lineSeparator() +\n            "')}";
        val output =
            "${io[i].output.trim("\n").replace(/\n/g, '" + System.lineSeparator() +\n            "')}";

        assertIO(input, output);
    }
`;
  }

  text += `
    private fun assertIO(input: String, output: String) {
        val sysIn = ByteArrayInputStream(input.toByteArray())
        System.setIn(sysIn)

        val sysOut = ByteArrayOutputStream()
        System.setOut(PrintStream(sysOut))

        abc000X()

        Assert.assertThat(sysOut.toString(), equalTo(output + System.lineSeparator()))
    }
}
`;

  return text;
};
