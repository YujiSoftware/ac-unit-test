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
      text.push('	public void ' + io[i].name + '() {');
      text.push('		String input = ');
      text.push('			"' + io[i].input.trim("\n").replace(/\n/g, '" + System.lineSeparator() +\n			"') + '";');
      text.push('		String output = ');
      text.push('			"' + io[i].output.trim("\n").replace(/\n/g, '" + System.lineSeparator() + \n			"') + '";');
      text.push('');
      text.push('		assertIO(input, output);');
      text.push('	}');
      text.push('');
    }
    
    text.push('	private void assertIO(String input, String output) {');
    text.push('		ByteArrayInputStream in = new ByteArrayInputStream(input.getBytes());');
    text.push('		System.setIn(in);');
    text.push('');
    text.push('		ByteArrayOutputStream out = new ByteArrayOutputStream();');
    text.push('		System.setOut(new PrintStream(out));');
    text.push('');
    text.push('		Main.main(new String[0]);');
    text.push('');
    text.push('		Assert.assertThat(output + System.lineSeparator(), is(out.toString()));');
    text.push('	}');
    text.push('}');
    
    return text.join("\n");
  };
});