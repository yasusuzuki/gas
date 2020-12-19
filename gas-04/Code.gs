
function openDialog() {
  var html = HtmlService.createHtmlOutputFromFile('index').setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(html, 'リマインドメール送信画面');
}

/**
  Gmailのドラフトを機械的に作成する。
  tableDataJSON: to, title, htmlMailBody, ccというプロパティを持つ連想配列のリスト
**/
function createEmail( tableDataJSON ){
  var tableData = JSON.parse(tableDataJSON);
  var numberOfSuccess = 0;
  for ( j = 0 ; j < tableData.length; j++){
    var row = [];
    if ( tableData[j].radio != "No" ){
      GmailApp.createDraft(
        tableData[j].to,  //宛先
        tableData[j].title,  //件名
        tableData[j].htmlMailBody, //テキスト形式のメール本文
        {cc:"manager@testmail.com",
         htmlBody:tableData[j].htmlMailBody });  //HTML形式のメール本文
      
      numberOfSuccess++;
      console.log("createEmail " + tableData[j].title );
    }
  }

  return numberOfSuccess;
}

  
/**
  特定のGoogle Sheetのデータを抽出して、JSONにして返却する関数
**/
function readFromGoogleSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('masterSheet');
  var range = sheet.getRange(3,1,sheet.getDataRange().getLastRow()-3,4); //3行目から最終行まで。1列目から4列を抽出
  var rangeValues = [];
  var lastColumn = range.getNumColumns();
  var lastRow = range.getNumRows();
  Logger.log("lastColumn:" + lastColumn + " lastRow:" + lastRow);
  for ( j = 1 ; j <= lastRow; j++){
    var row = [];
    for ( i = 1; i <= lastColumn; i++){
      row.push(range.getCell(j,i).getValue());
    };
    rangeValues.push(row);
  };
  return JSON.stringify(rangeValues);
}

// Google Sheetsに入力さがあるたびに呼ばれるコールバック関数
// 入力した内容を"log"シートに記録する
function onEdit(e) {
  console.log("onEdit is invoked:");
  updateLogSheet(e.value,e.oldValue,e.range.getA1Notation());
}

function updateLogSheet(newVlaue,oldValue, location){
  var logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('log');
  console.log( logSheet.getName() + newVlaue );
  var maxRowIndex = logSheet.getDataRange().getLastRow();
  
  //1列目に入力ユーザIDを設定する
  // getEmail()は、1度目は開発環境でデバッグすると、許可してよいかの確認を出してくれる。いきなりサイトで使用するとエラーになる。
  // 例え許可していても、スクリプトオーナーとスクリプト実行者が同じドメインでないとエラーになるらしい
  logSheet.getRange(maxRowIndex+1,1).setValue(Session.getActiveUser().getEmail());
  logSheet.getRange(maxRowIndex+1,2).setValue(getCurrentTime());
  
  //3列目に入力した値を設定する
  logSheet.getRange(maxRowIndex+1,3).setValue( newVlaue );

  //4列目に古い値を設定する
  logSheet.getRange(maxRowIndex+1,4).setValue( oldValue );
  
  //5列目に入力したセルの位置を設定する
  logSheet.getRange(maxRowIndex+1,5).setValue( location );

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
