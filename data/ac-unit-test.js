self.on("click", function(){
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

  self.postMessage(io);
});