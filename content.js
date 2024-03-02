chrome.runtime.onMessage.addListener(function (message, sender, callback) {
  if (message.functiontoInvoke != "onClick") {
    return;
  }

  const examples = onClick();
  chrome.storage.sync.get(["outer", "inner"], function (items) {
    const method = examples.map(e =>
      items.inner
        .replace(/{{\s*NAME*\s}}/g, e.name)
        .replace(/{{\s*INPUT\s*}}/g, e.input)
        .replace(/{{\s*OUTPUT\s*}}/g, e.output)
    ).join("\n");
    const code = items.outer.replace(/{{\s*METHOD\s*}}/g, method);

    callback(code);
  });

  return true;
});

function onClick() {
  let name = null;
  let input = null;
  let output = null;
  let examples = [];

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
        name = header.replace("入力例", "sample").replace(/\s+/g, "");
        input = example.trim();
      } else if (header.indexOf("出力例") == 0 || header.indexOf("Sample Output") == 0) {
        output = example.trim();
      }
    }

    if (name != null && input != null && output != null) {
      examples.push({ name: name, input: input, output: output });
      name = input = output = null;
    }
  }

  return examples;
}
