var clipboard = require("sdk/clipboard");
var self = require("sdk/self");

var cm = require("sdk/context-menu");

cm.Item({
  label: "ユニットテストを生成",
  accesskey: "U",
  context: cm.URLContext(/.*.contest.atcoder.jp\/tasks\/.*/),
  contentScriptFile: [self.data.url("jquery-2.1.4.min.js"), self.data.url("ac-unit-test.js")],
  onMessage: function(code){
    clipboard.set(code);
  }
});
