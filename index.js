var buttons = require("sdk/ui/button/action");
var clipboard = require("sdk/clipboard");
var pageMod = require("sdk/page-mod");
var tabs = require("sdk/tabs");
var tab_utils = require("sdk/tabs/utils");
var self = require("sdk/self");
var { viewFor } = require("sdk/view/core");

var cm = require("sdk/context-menu");

cm.Item({
  label: "Create JUnit Test",
  image: self.data.url("icon.png"),
  context: cm.URLContext(/.*.contest.atcoder.jp\/tasks\/.*/),
  contentScriptFile: [self.data.url("jquery-2.1.4.min.js"), self.data.url("ac-unit-test.js")],
  onMessage: function(code){
    clipboard.set(code);
  }
});

var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Mozilla",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  tabs.open("http://abc023.contest.atcoder.jp/assignments");
}



pageMod.PageMod({
  include: /.*.contest.atcoder.jp\/tasks\/.*/,
  contentScriptWhen: "ready",
  contentScriptFile: [self.data.url("jquery-2.1.4.min.js"), self.data.url("ac-unit-test.js")],
  onAttach: function(worker) {
    var lowLevelTab = viewFor(worker.tab);
    var window = tab_utils.getOwnerWindow(lowLevelTab);
    
    var stylesheet =
      window.document.createProcessingInstruction(
              'xml-stylesheet',
              'href="resource://acunittest/skin/overlay.css" type="text/css"');
    window.document.insertBefore(stylesheet, window.document.firstChild);

    // create button
    let image = window.document.createElement('image');
    image.id = 'acunittest-icon';
    image.className = 'urlbar-icon';
    image.addEventListener("click", function(){
      worker.port.emit("create");
    });

    // insert icon in urlbar
    let urlbarIcons = window.document.getElementById('urlbar-icons');
    urlbarIcons.insertBefore(image, urlbarIcons.firstChild);

    worker.port.on("created", function(sourceCode) {
      clipboard.set(sourceCode);
    });
  }
});