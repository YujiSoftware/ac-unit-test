self.on("click", function(){
  // 問題全体を取得
  var children = $("#task-statement").find("#task-statement").children();

  var name = null;
  var input = null;
  var output = null;
  var io = [];

  for(var i = 0; i < children.length; i++){
    var child = $(children[i]);
    if(child.hasClass("part")){
      var h3 = child.find("h3");
      var pre = child.find("pre");
      if(h3.length > 0 && pre.length > 0){
        var header = h3[0].textContent;
        var example = pre[0].textContent;
      
        if(header.indexOf("入力例") == 0){
          name = header;
          input = example;
        }else if(header.indexOf("出力例") == 0){
          output = example;
        }
      }
      
      if(name != null && input != null && output != null){
        io.push({ name: name, input: input, output: output });
        name = input = output = null;
      }
    }
  }

  self.postMessage(createJUnit(io));

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
    
    return text.join("\r\n");
  }
});