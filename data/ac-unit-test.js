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
          name = header.replace(/\s/g, "");
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

  self.postMessage(io);
});