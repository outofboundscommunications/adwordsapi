/**
 * this google sheet script reads data from the bing table, the adwords table and inserts each
 * into the TblAdWordsBing combined table
**/

function main() {
  Logger.clear();
  readWriteBingRows();
  readWriteAdWordsRows();
  calculateValues();
}

function readWriteBingRows() {
  var spreadSheet = SpreadsheetApp.openByUrl('https://docs.google.com/a/outofboundscommunications.com/spreadsheets/d/1-4VBv23qu5REfSxyHfGaLWrpmgQLlfwhsDc7VHBtRbQ/');
  var mySheet = spreadSheet.getSheetByName('TblBingAds');
  var rows = mySheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var myCombinedSheet = spreadSheet.getSheetByName('TblAdWordsBing')
  //clear out data for refresh
  myCombinedSheet.clearContents();
  //create header row in the TblAdWordsBing Sheet
  myCombinedSheet.appendRow(["src","year","month","imp","clicks","cost","ctr","conversions","convRate","cpa","revenue"]);
  //add data from TblBing to TblAdWordsBing
  for (var i=1; i <= numRows - 1; i++) {
    //fetch first row of data
	var row = values[i];
    var src = 'bing';
    for (j in values[i]) {
      var year = values[i][0];
      var month = values[i][1];
      var imp = values[i][2];
      var clicks = values[i][3];
      var cost = values[i][4];
      var ctr = clicks/imp;
      var cpc = cost/clicks;
      var conversions = values[i][6];
      var convRate = conversions/clicks;
      var cpa = cost/conversions;
      var revenue = values[i][8];
    } 
	//end of inner loop
    //and append that row of data to the sheet
    myCombinedSheet.appendRow([src,year,month, imp,clicks,cost,ctr,conversions,convRate,cpa,revenue]);
  }
  //end of outer loop
}
//end of readWriteBingRows() function

function readWriteAdWordsRows() {
  var spreadSheet = SpreadsheetApp.openByUrl('https://docs.google.com/a/outofboundscommunications.com/spreadsheets/d/1-4VBv23qu5REfSxyHfGaLWrpmgQLlfwhsDc7VHBtRbQ/');
  var mySheet = spreadSheet.getSheetByName('TblAdWords');
  var rows = mySheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  
  
  var myCombinedSheet = spreadSheet.getSheetByName('TblAdWordsBing');
  for (var i=1; i <= numRows - 1; i++) {
    //find the first empty row in the Table to append the adwords data
	var firstEmptyRow = myCombinedSheet.getLastRow()+1
    //fetch first row of data
	var row = values[i];
    var src = 'adwords';
    for (j in values[i]) {
      var year = values[i][0];
      var month = values[i][1];
      var imp = values[i][2];
      var clicks = values[i][3];
      var cost = values[i][4];
      var ctr = clicks/imp;
      var cpc = cost/clicks;
      var conversions = values[i][5];
      var convRate = conversions/clicks;
      var cpa = cost/conversions;
      var revenue = values[i][8];
    }
	//end of inner loop
    //and append that row of data to the sheet
    myCombinedSheet.appendRow([src,year,month, imp,clicks,cost,ctr,conversions,convRate,cpa,revenue]);
 }
 //end of outer loop
}
//end of readWriteAdWordsRows() function

 function calculateValues() {
   var spreadSheet = SpreadsheetApp.openByUrl('https://docs.google.com/a/outofboundscommunications.com/spreadsheets/d/1-4VBv23qu5REfSxyHfGaLWrpmgQLlfwhsDc7VHBtRbQ/');
   var myTbls = ['PivotPPCAccounts','PivotAdWordAccount','PivotBingAdsAccount'];
    //calculate conversion rate column for all tables 
    for (i=0;i<myTbls.length;i++) {
      calculateConvRate(myTbls[i]);
     }
	 
    function calculateConvRate(myTbl) {
      var mySheet = spreadSheet.getSheetByName(myTbl)
      var rows = mySheet.getDataRange();
      var numRows = rows.getNumRows()-1;
      var values = rows.getValues();
      //write header row to sheets
      var ConvRateHeader = mySheet.getRange([1],[7]).setValue("Conv Rate");
      var CpaHeader = mySheet.getRange([1],[8]).setValue("Cpa");
      var CpcHeader = mySheet.getRange([1],[9]).setValue("Cpc");
      var ROASHeader = mySheet.getRange([1],[10]).setValue("ROAS");
      //iterate thru rows
      for (var i = 1; i <= numRows; i++) {
        row = values[i];
        //iterate thru all the columns in row[i] and make calculations
        for (j in values[i]) {
          var Clicks = values[i][2];
          var Costs = values[i][3];
          var Transactions = values[i][4];
          var Revenue = values[i][5];
          //calc conv rate
          var ConvRate = Transactions/Clicks;
          //calc ROAS
          var ROAS = Revenue/Costs;
          Logger.log('the clicks are: ' + Clicks + " the % Conv is: " + ConvRate);
          //calc cpa
          var Cpa = Costs/Transactions;
          //calc cpc
          var Cpc = Costs/Clicks;
        }
		//write data to each cell
        var ConvRateCell = mySheet.getRange([i+1],[7]).setNumberFormat("%0.00");
        ConvRateCell.setValue(ConvRate);
        var CpaCell = mySheet.getRange([i+1],[8]).setNumberFormat("$0.00");
        CpaCell.setValue(Cpa);
        var CpcCell = mySheet.getRange([i+1],[9]).setNumberFormat("$0.00");
        CpcCell.setValue(Cpc);
        var RoasCell = mySheet.getRange([i+1],[10]).setNumberFormat("%0.00");
        RoasCell.setValue(ROAS);
      }
    }
    
  }
