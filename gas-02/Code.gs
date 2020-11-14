
function openDialog() {
  var html = HtmlService.createHtmlOutputFromFile('index').setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(html, 'jqGridTableのテスト');
}

function createEmail(){
   GmailApp.createDraft("yasuzuki@gmail.com","subject","test mail");
   
}

function log(){
  console.log("aaa");
  
}
  
/**
  特定のGoogle Sheetのデータを抽出して、JSONにして返却する関数
**/
function readFromGoogleSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('masterSheet');
  var range = sheet.getRange("A3:C100"); //とりあえず100行まで
  var rangeValues = [];
  var lastColumn = range.getNumColumns();
  var lastRow = range.getNumRows();
  Logger.log( lastRow + ":" + lastColumn);
  for ( j = 1 ; j <= lastRow; j++){
    var row = [];
    for ( i = 1; i <= lastColumn; i++){
      row.push(range.getCell(j,i).getValue());
    };
    rangeValues.push(row);
  };
  return JSON.stringify(rangeValues);
}
