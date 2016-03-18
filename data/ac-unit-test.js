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

    // SECTION の中に H3 タグがある場合と、
    // SECTION の直前に H3 タグがある場合がある(ARC014_A)
    if(h3.length == 0){
      var prev = section.prev();
      if(prev.length > 0 && prev[0].tagName == "H3"){
        h3 = prev;
      }
    }
    
    if(h3.length > 0 && pre.length > 0){
      var header = h3[0].textContent.trim();
      var example = pre[0].textContent;
    
      if(header.indexOf("入力例") == 0){
        name = header.replace(/\s+/g, "_");
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

  self.postMessage(io);
});