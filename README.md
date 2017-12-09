#AtCoder Unit Test (Google Chrome版)

AtCoder の問題ページから、ユニットテストを生成する Google Chrome アドオンです。

##ダウンロード

* Firefox 版： [AC Unit Test :: Add-ons for Firefox](https://addons.mozilla.org/ja/firefox/addon/ac-unit-test/ "AC Unit Test :: Add-ons for Firefox")
* Google Chrome 版： [AC Unit Test - Chrome ウェブストア](https://chrome.google.com/webstore/detail/lmahhninbclefepjbcdfbcjnancipfmi/ "AC Unit Test - Chrome ウェブストア")

##対応言語

* Java (JUnit)
* C# (MS Test)

対応言語の切り替えは、拡張機能 → AC Unit Test の「オプション」で行えます。

##使い方

1. AtCoder の問題ページを開く
2. 右クリック → "ユニットテストを生成" をクリック

これで、ユニットテストがクリップボードにコピーされました！
あとは、任意のエディタで「貼り付け」を行ってください。

##（参考）eclipse でのユニットテスト作成＆実行方法

1. （Main.java と同じところで）右クリック → "新規" → "JUnit テスト・ケース" をクリック
2. 以下の設定を行い、"Finish" ボタンをクリック
    * 新規 JUnit 4 テスト
    * パッケージ: (空欄)
    * 名前: MainTest
3. "新規 JUnit テスト・ケース" ダイアログが表示されたら、"次のアクションを実行 (JUnit 4 ライブラリーをビルド・パスに追加)" を選択し、"OK" ボタンをクリック
4. AtCoder の問題ページを開いて、右クリック → "ユニットテストを生成" をクリック
5. MainTest.java 上で右クリック → "実行" → "JUnit テスト" をクリック

## Firefox 版

[YujiSoftware/ac-unit-test: AtCoder の問題ページから、ユニットテストを生成する Firefox アドオン](https://github.com/YujiSoftware/ac-unit-test "YujiSoftware/ac-unit-test: AtCoder の問題ページから、ユニットテストを生成する Firefox アドオン")

## License

The MIT License (MIT)
Copyright (c) 2016 YujiSoftware

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
