# Google Apps Script(gas)のサンプル
--
## gas-02の概要
 * 作業リストの進捗状況をもとに、リマインドメールの宛先などを機械的に編集してGmailの下書きを作成する機能。
 * 「masterSheet」がタスクリストと進捗を管理するためのリストだが、今のところ、Title、To、Detail、Ccの４列があるシンプルなリストを想定している。
 * 巷でいうMail Merge機能に近いが、Mail Mergeは類似のメールを個人向けに文言などを機械的に変換して１件１件メールを送信するが、このサンプルは、１案件あたり１メール。

## 前提条件
 * 「masterSheet」というシートがあり、そこに４列分の情報がある
 * 「log」というシートがある。


## ローカルでデバッグしたい場合
 * index.htmlの中央付近に以下の行がある。この"DEBUG = false"をコメントアウトすると、index.htmlはGoogle Scriptに接続しなくなる。 
```
var DEBUG = true;
DEBUG = false;
```
