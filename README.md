# AtCoder Unit Test

AtCoder の問題ページから、ユニットテストを生成する Firefox / Google Chrome アドオンです。

## ダウンロード

* Firefox 版： [AC Unit Test :: Add-ons for Firefox](https://addons.mozilla.org/firefox/addon/ac-unit-test/ "AC Unit Test :: Add-ons for Firefox")
* Google Chrome 版： [AC Unit Test - Chrome ウェブストア](https://chrome.google.com/webstore/detail/lmahhninbclefepjbcdfbcjnancipfmi/ "AC Unit Test - Chrome ウェブストア")

## 対応言語

* Java (JUnit)
* C# (MS Test)
* Python3 (unittest)
* Kotlin (JUnit,AssertJ)

対応言語の切り替えは、拡張機能 / アドオン → AC Unit Test の「オプション」で行えます。  
※デフォルトでは`Java (JUnit)`になっています。

## 使い方

1. AtCoder の問題ページを開く
2. 右クリック → `ユニットテストを生成` をクリック

これで、ユニットテストがクリップボードにコピーされました！
あとは、任意のエディタで「貼り付け」を行ってください。

## 使用上の注意

* C#
    * 問題を解くクラスの名前を `Program` にする必要があります。
* Python
    * 問題を解く関数の名前を `resolve` にする必要があります。

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
※1前提として、テスト対象クラスの`main`メソッドが、パッケージ内で一意となるメソッド名(例`abc123A()`)の呼び出しのみを行っている作りになっていることを想定。  
(AtCoderの制約上、トップレベル関数の`main`が呼び出されることを想定した実装をする必要があるが、同じパッケージ内にトップレベル関数で同じ名前のメソッド(ここでは`main`)が定義されているとテストコード側で区別ができずコンパイルエラーとなってしまうため、このような作りを前提としている(もっとベターな方法はあるかも))
1. テスト対象のクラスの`main`メソッドにキーボードカーソルを載せ、`Alt+Enter` → `テストの作成`をクリック
    1. `Alt+Enter`の代わりに`Alt+Insert`→`テスト`、もしくは`main`メソッドを右クリック→`生成`→`テスト`でも可
2. よしなに作成してくれるので、テストファイルのパッケージ宣言(1行目)より下を、このツールで生成したテストケースに全て置き換える
3. `assertIO`メソッド内の`abc000X()`をテスト対象の`abc123A()`などに書き換える。
4. テストクラスの左にある緑矢印を左クリックorタブ一覧でテストケースを右クリック

## License

The MIT License (MIT)
Copyright (c) 2016 YujiSoftware

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
