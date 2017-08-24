var clipboard = require("sdk/clipboard");
var prefs = require("sdk/simple-prefs").prefs;
var self = require("sdk/self");
var _ = require("sdk/l10n").get;

var cm = require("sdk/context-menu");
cm.Item({
  label: _("generate"),
  accesskey: "U",
  context: cm.URLContext([/.*\.contest\.atcoder\.jp\/tasks\/.+/, /.*\/\/beta\.atcoder\.jp\/contests\/.*\/tasks\/.+/]),
  contentScriptFile: [self.data.url("jquery-2.1.4.min.js"), self.data.url("ac-unit-test.js")],
  onMessage: function(io){
    var code;
    switch(prefs.language){
      case "Java":
        code = createJUnit(io);
        break;
      case "CSharp":
        code = createMSTest(io);
        break;
      default:
        throw new Error("Unknown language. [prefs.language=" + prefs.language + "]");
    }
  
    clipboard.set(code);
  }
});

function createJUnit(io){
  var text = [];
  
  text.push('import static org.hamcrest.CoreMatchers.is;');
  text.push('');
  text.push('import java.io.ByteArrayInputStream;');
  text.push('import java.io.ByteArrayOutputStream;');
  text.push('import java.io.PrintStream;');
  text.push('');
  text.push('import org.junit.Assert;');
  text.push('import org.junit.Test;');
  text.push('');
  text.push('public class MainTest {');
  text.push('');
  
  for(var i = 0; i < io.length; i++){
    text.push('	@Test');
    text.push('	public void ' + io[i].name + '() throws Exception {');
    text.push('		String input = ');
    text.push('			"' + io[i].input.trim("\n").replace(/\n/g, '" + System.lineSeparator() +\n			"') + '";');
    text.push('		String output = ');
    text.push('			"' + io[i].output.trim("\n").replace(/\n/g, '" + System.lineSeparator() + \n			"') + '";');
    text.push('');
    text.push('		assertIO(input, output);');
    text.push('	}');
    text.push('');
  }
  
  text.push('	private void assertIO(String input, String output) throws Exception {');
  text.push('		ByteArrayInputStream in = new ByteArrayInputStream(input.getBytes());');
  text.push('		System.setIn(in);');
  text.push('');
  text.push('		ByteArrayOutputStream out = new ByteArrayOutputStream();');
  text.push('		System.setOut(new PrintStream(out));');
  text.push('');
  text.push('		Main.main(new String[0]);');
  text.push('');
  text.push('		Assert.assertThat(out.toString(), is(output + System.lineSeparator()));');
  text.push('	}');
  text.push('}');
  text.push('');
  
  return text.join("\n");
};

function createMSTest(io){
  var text = [];
  
  text.push('using Microsoft.VisualStudio.TestTools.UnitTesting;');
  text.push('using System;');
  text.push('using System.IO;');
  text.push('');
  text.push('namespace AtCoder');
  text.push('{');
  text.push('    [TestClass]');
  text.push('    public class ProgramTest');
  text.push('    {');
  
  for(var i = 0; i < io.length; i++){
    text.push('        [TestMethod]');
    text.push('        public void ' + io[i].name + '()');
    text.push('        {');
    text.push('            string input =');
    text.push('@"' + io[i].input.trim("\n").replace(/\n/g, '\r\n') + '";');
    text.push('            string output =');
    text.push('@"' + io[i].output.trim("\n").replace(/\n/g, '\r\n') + '";');
    text.push('');
    text.push('            AssertIO(input, output);');
    text.push('        }');
    text.push('');
  }
  
  text.push('        private void AssertIO(string input, string output)');
  text.push('        {');
  text.push('            StringReader reader = new StringReader(input);');
  text.push('            Console.SetIn(reader);');
  text.push('');
  text.push('            StringWriter writer = new StringWriter();');
  text.push('            Console.SetOut(writer);');
  text.push('');
  text.push('            Program.Main(new string[0]);');
  text.push('');
  text.push('            Assert.AreEqual(output + Environment.NewLine, writer.ToString());');
  text.push('        }');
  text.push('    }');
  text.push('}');
  text.push('');
  
  return text.join("\r\n");
}