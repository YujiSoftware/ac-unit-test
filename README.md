# AtCoder Unit Test

AtCoder の問題ページから、ユニットテストを生成する Firefox / Google Chrome アドオンです。

## ダウンロード

* Firefox 版： [AC Unit Test :: Add-ons for Firefox](https://addons.mozilla.org/firefox/addon/ac-unit-test/ "AC Unit Test :: Add-ons for Firefox")
* Google Chrome 版： [AC Unit Test - Chrome ウェブストア](https://chrome.google.com/webstore/detail/lmahhninbclefepjbcdfbcjnancipfmi/ "AC Unit Test - Chrome ウェブストア")

## 対応言語

* Python3 (unittest)
* Java (JUnit)
* Kotlin (JUnit)
* C# (MS Test)

対応言語の切り替えは、設定から行います。  
※デフォルトでは `Python` になっています。

## 使い方

1. AtCoder の問題ページを開く
2. ツールバーの ✅ をクリック

これで、ユニットテストがクリップボードにコピーされました！
あとは、任意のエディタで「貼り付け」を行ってください。

## （参考）eclipse でのユニットテスト作成＆実行方法

1. （Main.java と同じところで）右クリック → "新規" → "JUnit テスト・ケース" をクリック
2. 以下の設定を行い、"Finish" ボタンをクリック
    * 新規 JUnit 4 テスト
    * パッケージ: (空欄)
    * 名前: MainTest
3. "新規 JUnit テスト・ケース" ダイアログが表示されたら、"次のアクションを実行 (JUnit 4 ライブラリーをビルド・パスに追加)" を選択し、"OK" ボタンをクリック
4. AtCoder の問題ページを開いて、右クリック → "ユニットテストを生成" をクリック
5. MainTest.java 上で右クリック → "実行" → "JUnit テスト" をクリック

## (参考) IntelliJでのKotlinのユニットテスト作成&実行方法
1. テスト対象のクラスの`main`メソッドにキーボードカーソルを載せ、`Alt+Enter` → `テストの作成`をクリック
    1. `Alt+Enter`の代わりに`Alt+Insert`→`テスト`、もしくは`main`メソッドを右クリック→`生成`→`テスト`でも可
2. よしなに作成してくれるので、テストファイルのパッケージ宣言(1行目)より下を、このツールで生成したテストケースに全て置き換える
3. `assertIO`メソッド内の`abc000X()`をテスト対象の`abc123A()`などに書き換える。
4. テストクラス/テストケースの左にある緑矢印を左クリック or タブ一覧でテストケースを右クリックし、テストを実行する
