#AC Unit Test
AtCoder の問題ページから、ユニットテストを生成する Firefox アドオンです。

##ダウンロード

* Firefox 版： [AC Unit Test :: Add-ons for Firefox](https://addons.mozilla.org/ja/firefox/addon/ac-unit-test/ "AC Unit Test :: Add-ons for Firefox")
* Google Chrome 版： [AC Unit Test - Chrome ウェブストア](https://chrome.google.com/webstore/detail/lmahhninbclefepjbcdfbcjnancipfmi/ "AC Unit Test - Chrome ウェブストア")

##対応言語

* Java (JUnit)
* C# (MS Test)

対応言語の切り替えは、アドオン → AC Unit Test を開いたところにある「プログラミング言語」のラジオボタンで行えます。

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

## Google Chrome 版

[YujiSoftware/ac-unit-test-chrome: AtCoder の問題ページから、ユニットテストを生成する Google Chrome アドオン](https://github.com/YujiSoftware/ac-unit-test-chrome "YujiSoftware/ac-unit-test-chrome: AtCoder の問題ページから、ユニットテストを生成する Google Chrome アドオン")
