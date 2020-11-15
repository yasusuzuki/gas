## gas-01の概要
 * Google Sitesで、ちょっとしたチャットツール。コメントはGoogle Spreadsheetに保存され、画像も張り付けられる。添付ファイルもアップロードできる。アップロードされた添付ファイルはGoogle Driveに帆zンされる。

## 自分のGoogleアカウントでサンプルを実行する手順
 * 1. gas-01のファイルを全部ダウンロードする
 * 2. 自分が管理者となっているGoogle Sitesを開く。右上の歯車のアイコン[その他の操作]をクリックし、メニューを開き、[サイトを管理]をクリックし、管理者のページを開く
 * 3．管理者のページの左側の中に[Apps Script]があるのでそれを開く
 * 4．上のほうにある、[新しいスクリプトを追加]をクリックし、新しいGoogle Apps Scriptのプロジェクトを開く。注意点として、ここで作成したアプリケーションは、このサイトでのみ有効。他に、Google DriveでGoogle Apps Scriptプロジェクトを作成し、複数のサイトで共有することも可能だが、手間が多いので今回は割愛する。
 * 5. 手順1.でダウンロードしたファイルを全部張り付ける。本当は、インポート機能で一括でアップロードできるらしいが、特別なクライアントを自分のPCにインストールしないといけないらしいので、ここでは手動で張り付ける。
 * 6. これだけだと、Google Sitesというい公の場での利用が許可されていない。実際に利用できるようにするため、プロジェクトを公開しなければならない。上の[File]メニューの[Manabe Versions]ダイアログを開く。
 * 7. [Describe what has changed]の入力フォームに適当に変更の概要を記載し、右隣りの[Save New Version]をクリックする。
 * 8. すると、ダイアログの下部に、新しい行が追加される。この新しく追加されたVersion番号を覚えておく。ここでは、おそらく初めてなはずなのでVersion番号は1のはず。
 * 9. ダイアログの下部にある[OK]を押し、ダイアログを閉じる
 * 10. ページ上部の[Publish]メニュー内の[Deploy as WebApp]をクリックし、ダイアログを開く
 * 11. さきほど追加されたProject Versionを選び、[Update]ボタンを押す
 * 12. ”This project is now deployed as a web app.”というメッセージが表示されたダイアログが現れればPublish成功
 * 13. Google Sitesページに戻り、どのページでもよいので、ページを編集する
 * 14. 編集画面上部にある[挿入メニュー]の[Apps Script]をクリックするとこのGoogle Sitesで利用可能なGoogle Apps Scriptプロジェクトが一覧に出てくるはす。そこで、自分が作成したプロジェクトを選ぶと、Google Apps Scriptをページに挿入される。
 * 15. ページを保存する。これで、動かなければ何か問題がある。

### よくある問題
 * Google Apps ScripがGoogle Sites上で動かない。Javascriptデバッグモードでエラーログを確認すると、"ファイルのアクセス権限がない"というエラーが出ている。
   * Google Apps ScriptがGoogle Drive上のSpreadsheetなどにアクセスする場合、そのSpreadsheetのファイル毎にアクセス許可の設定をしなくてはいけない。Google Apps Projectでいったんデバッグモードで実行すると、アクセス許可してよいか尋ねられるので、はい、を選ぶとそのGoogle Apps Scriptは以降そのファイルへアクセスができるようになる。

 * Google Apps Script公式ページの「よくある問題と対策」の日本語訳
   * http://qiita.com/hidehigo/items/96a1a295aa6e8d46eaac#authorization-is-required-to-perform-that-action 
 
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
   * 2. *.html内で外部のファイルを外部サイトからインポートしている場合、
```
<script type="text/javascript" src='//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js '></script>
<script type="text/javascript" src='//ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js'></script>
```
   * 以下のようにhttp:を追加する。
```
<script type="text/javascript" src='http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js '></script>
<script type="text/javascript" src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js'></script>
```


##ローカルで動かない場合
 * Google Apps ScripがGoogle Sites上で動かない。Javascriptデバッグモードでエラーログを確認すると、"Authorization is required to perform that action"というエラーが出ている。
   *  CORS (クロスオリジンリソースシェアリング)の制限の可能性が高い。以下のページが参考になる。
   *  http://tadtak.jugem.jp/?eid=59
   *  一番手っ取り早い解決策は、サーバサイドのスタブアプリが常に、HTTPレスポンスヘッダに”Access-Control-Allow-Origin:*”を設定する。JAX-RSでスタブを作成しているのであれば、サーブレットフィルタでHTTPレスポンスヘッダを毎回修正するようにすればよい。
