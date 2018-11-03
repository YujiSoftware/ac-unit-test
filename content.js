chrome.runtime.onMessage.addListener(function (message, sender, callback) {
  if (message.functiontoInvoke == "onClick") {
    var io = onClick();
    
    chrome.storage.sync.get({
      language: 'Java',
    }, function(items) {
      switch(items.language){
        case "Java":
          copy(createJUnit(io));
          break;
        case "CSharp":
          copy(createMSTest(io));
          break;
        case "Python3":
          copy(createPyUnittest(io));
          break;
        default:
          throw new Error("Unknown language. [items.language=" + items.language + "]");
      }
    });
  }
});

function onClick(){
  var name = null;
  var input = null;
  var output = null;
  var io = [];

  var sections = $("#task-statement section");
  for(var i = 0; i < sections.length; i++){
    var section = $(sections[i]);
  
    var h3 = section.find("h3");
    var pre = section.find("pre");

    // SECTION の中に H3 タグがある場合(ABC033_D)と、
    // SECTION の直前に H3 タグがある場合(ARC014_A)がある
    if(h3.length == 0){
      var prev = section.prev();
      if(prev.length > 0 && prev[0].tagName == "H3"){
        h3 = prev;
      }
    }
    
    if(h3.length > 0 && pre.length > 0 && $(h3[0]).is(":visible")){
      var header = h3[0].textContent.trim();
      var example = pre[0].textContent;

      // シンタックスハイライトされている場合、リスト形式に
      // なっているので、一行ずつ取り出す (ABC007_3、など)
      var pretty = pre[0].getElementsByTagName("li");
      if(pretty.length > 0){
        example = "";
        for(var j = 0; j < pretty.length; j++){
          example += pretty[j].textContent;
          example += "\n";
        }
      }

      if(header.indexOf("入力例") == 0 || header.indexOf("Sample Input") == 0){
        name = header.replace(/\s+/g, "_");
        input = example;
      }else if(header.indexOf("出力例") == 0 || header.indexOf("Sample Output") == 0){
        output = example;
      }
    }
    
    if(name != null && input != null && output != null){
      io.push({ name: name, input: input, output: output });
      name = input = output = null;
    }
  }

  return io;
}

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

function createPyUnittest(io) {
  var text = [];
  
  text.push('import sys');
  text.push('from io import StringIO')
  text.push('import unittest');
  text.push('');
  
  text.push('class TestClass(unittest.TestCase):');
  text.push('    def assertIO(self, input, output):');
  text.push('        stdout, stdin = sys.stdout, sys.stdin');
  text.push('        sys.stdout, sys.stdin = StringIO(), StringIO(input)');
  text.push('        resolve()');
  text.push('        sys.stdout.seek(0)');
  text.push('        out = sys.stdout.read()[-1]');
  text.push('        sys.stdout, sys.stdin = stdout, stdin');
  text.push('        self.assertEqual(out, output)')
  
  for(var i = 0; i < io.length; i++){
    text.push('    def test_' + io[i].name + '(self):');
    text.push('        input = """' + io[i].input.trim("\n").replace(/\n/g, '\r\n') + '"""');
    text.push('        output = """' + io[i].output.trim("\n").replace(/\n/g, '\r\n') + '"""');
    text.push('        self.assertIO(input, output)');
  }
  text.push('');
  
  text.push('if __name__ == "__main__":');
  text.push('    unittest.main()');
  
  return text.join("\r\n");
}

function copy(text){
    var textArea = document.createElement("textarea");
    textArea.style.cssText = "position: absolute; left: -100%;";

    try{
        document.body.appendChild(textArea);

        textArea.value = text;
        textArea.select();
    
        document.execCommand("copy");
    }finally{
        document.body.removeChild(textArea);
    }
}
