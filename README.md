# Google Apps Script(gas)のサンプル
--
## 構成
 * gas-01 : Google Sitesで、ちょっとしたチャットツール。コメントはGoogle Spreadsheetに保存され、画像も張り付けられる。添付ファイルもアップロードできる。アップロードされた添付ファイルはGoogle Driveに帆zンされる。

## ローカルでクライアント部分(JavaScript部分)だけをテストしたいとき
 * 概要
   * *.gsのファイルに、サーバサイドで動くGoogle Apps Scriptが書かれている。Google Apps Scriptを自分のPCで実行できる環境はないため、この部分だけスタブを作成する必要がある。
   * *.htmlのファイルに、HTMLとJavaScriptが書かれている。JavaScript部分が、サーバサイドのGoogle Apps Scriptを呼び出しているが、このAPIがGoogle Apps Scrip固有部分なので、ローカルのWebサーバに接続するように変更する必要がある。
 * 手順
   * 1. JAX-RSで、サーバサイド部分のスタブを作成する(JavaEE6以上を使用すること。JAX-RSが搭載されている)
     * jaxrsのリポジトリを参照。サンプルプログラムが掲載されている
   * 2. *.htmlファイル内の以下のJavaScript部分を

```
    google.script.run
    //Googleサーバスクリプトの呼び出し結果をコールバックで受け取る
    .withSuccessHandler(function(result) {
       $('#div_title').html( result.title ); 
       $('#div_summary').html( result.summary ); 
       $('#div_comments').html( result.comments ); 
    })
    //Googleサーバスクリプトの実行
    .loadMySpreadSheet();
```
   * 以下のように変更する  
```
	$.get("http://localhost:9080/jaxrs-test-03/api/gas/loadMySpreadSheet", function(result) {
       $('#div_title').html( result.title ); 
       $('#div_summary').html( result.summary ); 
       $('#div_comments').html( result.comments ); 
	});
```
