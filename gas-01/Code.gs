/**
 * SummerNoteというWISWIGエディタライブラリを使って、コメントを入力してもらう
 * 入力したコメントはGoogle Spreadsheetに保存される。
 * 保存されたコメントは、画面に順番に表示される。
 * JavaScriptは、jQueryとBootstrapを利用している
**/

var gDriveFolderId = "0B1PLZxt9LkLxTl9hTHNjRUtJTWs";
  //https://docs.google.com/spreadsheets/d/1pvZecUnGhvuszyK8UWXFnB3OuPMdmDYC57W6ayWh0Vw/pubhtml
var gDriveSpreadSheetId = "1pvZecUnGhvuszyK8UWXFnB3OuPMdmDYC57W6ayWh0Vw";

//最初に呼ばれるエントリーポイント
function doGet(e) {
  var t = HtmlService.createTemplateFromFile('index');
  return t.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
  
}

//ファイルアップロード
//引数には、<form>のDOMオブジェクトで、その直下に"myFile"という名前の<input type="file">が存在する想定
function processFileUpload(myForm){
  var fileBlob = myForm.myFile;
  var folder = DriveApp.getFolderById(gDriveFolderId);
  var doc = folder.createFile(fileBlob);

  //ページ内部にThanks.htmlの内容を呼び出す。
  return {fileUrl: doc.getUrl(), fileName: doc.getName() }; 
}

//パネルにSpreadSheetからデータをロードする
function loadMySpreadSheet(){
  var SS = SpreadsheetApp.openById(gDriveSpreadSheetId);
  var S1 = SS.getSheetByName("WISWIG-comments");
  var data = S1.getDataRange().getValues();
  var title = "(non-title)";
  var summary = "<ul><li>(task1)</li><li>(task2)</li><li>××を達成する</li></ul>";
  var comments = "";  
  for (var i = data.length-1; i >= 0; i--) {
    if (data[i][0] === 'title') {
      title = data[i][1];
    } else if (data[i][0] === 'summary') {
      summary = data[i][1];
    } else if (data[i][0] === 'comment') {
      var userEmail = data[i][1] ? data[i][1] : "(anonymous)";
      var comment   = data[i][2] ? data[i][2] : "";
      comments +=  "<b>#" + i + " " + userEmail + "</b></br>" + comment + "</br><hr>";
    }
  }

  return {title: title, summary: summary, comments: "" + comments + ""};
}

//"script-sample-spreadsheet"に入力フォームを保存する
function updateMySpreadSheet(markupStr){
  var SS = SpreadsheetApp.openById(gDriveSpreadSheetId);
  var S1 = SS.getSheetByName("WISWIG-comments");  
  Logger.log( SS.getName() + markupStr );
  var maxRowIndex = S1.getDataRange().getLastRow();
  
  //1列目はシステムIDとかいれる。
  S1.getRange(maxRowIndex+1,1).setValue( "comment" );

  //1列目に入力ユーザIDを設定する
  // getEmail()は、1度目は開発環境でデバッグすると、許可してよいかの確認を出してくれる。いきなりサイトで使用するとエラーになる。
  // 例え許可していても、スクリプトオーナーとスクリプト実行者が同じドメインでないとエラーになるらしい
  S1.getRange(maxRowIndex+1,2).setValue(  " by " + Session.getActiveUser().getEmail() + " at " + getCurrentTime() );
  
  //2列目に入力したコメントを設定する
  S1.getRange(maxRowIndex+1,3).setValue( markupStr );
  return {data:  markupStr}; 
}

function getCurrentTime(){
  var Nowymdhms　=　new Date();
  var NowYear = Nowymdhms.getYear();
  var NowMon = Nowymdhms.getMonth() + 1;
  var NowDay = Nowymdhms.getDate();
  var NowHour = Nowymdhms.getHours();
  var NowMin = Nowymdhms.getMinutes();
  var NowSec = Nowymdhms.getSeconds();
  if(NowMon < 10){
    NowMon = "0"+NowMon;
  }
  if(NowHour < 10){
    NowHour = "0"+NowHour;
  }
  if(NowMin < 10){
    NowMin = "0"+NowMin;
  }
  return NowYear + "/" + NowMon + "/" + NowDay + " " + NowHour+":"+NowMin+":"+NowSec;
}