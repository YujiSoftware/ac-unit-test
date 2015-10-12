var buttons = require("sdk/ui/button/action");
var clipboard = require("sdk/clipboard");
var tabs = require("sdk/tabs");
var self = require("sdk/self");

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
