/**
 * you run the bing function to add data rows from the TblBingAds (note insert/overwrite of prior data)
 * then you run the adwords function to append rows from the TblAdWords (note append at first empty row)
 * at least for moment, you need to run bing function then adwords function.

**/

readWriteBingRows();
readWriteAdWordsRows();
calculateValues() ;

function readWriteBingRows() {
  var spreadSheet = SpreadsheetApp.openByUrl('https://docs.google.com/a/outofboundscommunications.com/spreadsheets/d/1-4VBv23qu5REfSxyHfGaLWrpmgQLlfwhsDc7VHBtRbQ/edit#gid=1037756294');
  var mySheet = spreadSheet.getSheetByName('TblBingAds');
  var rows = mySheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  
  //Logger.log('the number of rows is: ' + numRows);

  for (var i = 0; i <= numRows - 1; i++) {
    var row = values[i];
    Logger.log(row);
  }
  
  var myCombinedSheet = spreadSheet.getSheetByName('TblAdWordsBing')
  
  //clear out data for refresh
  myCombinedSheet.clearContents();
   
  //create header
  myCombinedSheet.getRange([1],[1]).setValue("src");
  myCombinedSheet.getRange([1],[2]).setValue("month");
  myCombinedSheet.getRange([1],[3]).setValue("imp");
  myCombinedSheet.getRange([1],[4]).setValue("clicks");
  myCombinedSheet.getRange([1],[5]).setValue("cost");
  myCombinedSheet.getRange([1],[6]).setValue("ctr"); 
  myCombinedSheet.getRange([1],[7]).setValue("conversions");
  myCombinedSheet.getRange([1],[8]).setValue("convRate");
  myCombinedSheet.getRange([1],[9]).setValue("cpa");
  myCombinedSheet.getRange([1],[10]).setValue("revenue")
  
  //add data from TblBing to combined table
  for (var i=1; i <= numRows - 1; i++) {
    var row = values[i];
    //myCombinedSheet.appendRow(row);
    var src = 'bing';
    for (j in values[i]) {
      var month = values[i][0];
      var imp = values[i][1];
      var clicks = values[i][2];
      var cost = values[i][3];
      //var ctr = values[i][4]/100;//100;//divide by 100 to get correct decimal format
      var ctr = clicks/imp;
      var cpc = values[i][4];
      var conversions = values[i][5];
      //var convRate = values[i][6];
      var convRate = conversions/clicks;
      //var cpa = values[i][7];
      var cpa = cost/conversions;
      var revenue = values[i][8];
      myCombinedSheet.getRange([i+1],[1]).setValue(src);
      myCombinedSheet.getRange([i+1],[2]).setValue(month);
      myCombinedSheet.getRange([i+1],[3]).setValue(imp);
      myCombinedSheet.getRange([i+1],[4]).setValue(clicks);
      myCombinedSheet.getRange([i+1],[5]).setNumberFormat("$0.00").setValue(cost);
      myCombinedSheet.getRange([i+1],[6]).setNumberFormat("%0.00").setValue(ctr)
      myCombinedSheet.getRange([i+1],[7]).setValue(conversions);
      myCombinedSheet.getRange([i+1],[8]).setNumberFormat("%0.00").setValue(convRate);
      myCombinedSheet.getRange([i+1],[9]).setNumberFormat("$0.00").setValue(cpa);
      myCombinedSheet.getRange([i+1],[10]).setNumberFormat("$0.00").setValue(revenue);
    
  }

}
}

function readWriteAdWordsRows() {
  var spreadSheet = SpreadsheetApp.openByUrl('https://docs.google.com/a/outofboundscommunications.com/spreadsheets/d/1-4VBv23qu5REfSxyHfGaLWrpmgQLlfwhsDc7VHBtRbQ/edit#gid=1037756294');
  var mySheet = spreadSheet.getSheetByName('TblAdWords');
  var rows = mySheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  
  Logger.log('the number of rows is: ' + numRows);

  for (var i = 0; i <= numRows - 1; i++) {
    var row = values[i];
    Logger.log(row);
  }
  
  var myCombinedSheet = spreadSheet.getSheetByName('TblAdWordsBing');
  for (var i=1; i <= numRows - 1; i++) {
    var firstEmptyRow = myCombinedSheet.getLastRow()+1
    var row = values[i];
    var src = 'adwords';
    for (j in values[i]) {
      var month = values[i][0];
      var imp = values[i][1];
      var clicks = values[i][2];
      var cost = values[i][3];
      var ctr = clicks/imp;
      var cpc = values[i][4];
      var conversions = values[i][5];
      //var convRate = values[i][6];
      var convRate = conversions/clicks;
      //var cpa = values[i][7];
      var cpa = cost/conversions;
      var revenue = values[i][8];
      myCombinedSheet.getRange([firstEmptyRow],[1]).setValue(src);
      myCombinedSheet.getRange([firstEmptyRow],[2]).setValue(month);
      myCombinedSheet.getRange([firstEmptyRow],[3]).setValue(imp);
      myCombinedSheet.getRange([firstEmptyRow],[4]).setValue(clicks);
      myCombinedSheet.getRange([firstEmptyRow],[5]).setNumberFormat("$0.00").setValue(cost);
      myCombinedSheet.getRange([firstEmptyRow],[6]).setNumberFormat("%0.00").setValue(ctr)
      myCombinedSheet.getRange([firstEmptyRow],[7]).setValue(conversions);
      myCombinedSheet.getRange([firstEmptyRow],[8]).setNumberFormat("%0.00").setValue(convRate);
      myCombinedSheet.getRange([firstEmptyRow],[9]).setNumberFormat("$0.00").setValue(cpa)
      myCombinedSheet.getRange([firstEmptyRow],[10]).setNumberFormat("$0.00").setValue(revenue);
  }

}
}

 function calculateValues() {
    
   var spreadSheet = SpreadsheetApp.openByUrl('https://docs.google.com/a/outofboundscommunications.com/spreadsheets/d/1-4VBv23qu5REfSxyHfGaLWrpmgQLlfwhsDc7VHBtRbQ/edit#gid=1037756294');
   var myTbls = ['PivotPPCAccounts','PivotAdWordAccount','PivotBingAdsAccount'];
    
    Logger.log('the array length is: ' + myTbls.length);
    
    //calculate conversion rate column for all tables 
    for (i=0;i<myTbls.length;i++) {
      Logger.log('the table to run is: ' + myTbls[i]);
      calculateConvRate(myTbls[i]);
      Logger.log('finished calc Conv rate for: ' + myTbls[i]);
    }
    
    function calculateConvRate(myTbl) {

      var mySheet = spreadSheet.getSheetByName(myTbl)
      var rows = mySheet.getDataRange();
      var numRows = rows.getNumRows()-1;
      var values = rows.getValues();
      
      var ConvRateHeader = mySheet.getRange([1],[6]).setValue("Conv Rate");
      var CpaHeader = mySheet.getRange([1],[7]).setValue("Cpa");
      var CpcHeader = mySheet.getRange([1],[8]).setValue("Cpc");
      var ROASHeader = mySheet.getRange([1],[9]).setValue("ROAS");
      
      
      Logger.log('the number of rows is: ' + numRows);
      //iterate thru rows
      for (var i = 1; i <= numRows; i++) {
        row = values[i];
        Logger.log(row);
        //iterate thru all the columns in row[i] and make calculations
        for (j in values[i]) {
          var Clicks = values[i][1];
          var Costs = values[i][2];
          var Transactions = values[i][3];
          var Revenue = values[i][4];
          //calc conv rate
          var ConvRate = Transactions/Clicks;
          //calc ROAS
          var ROAS = Revenue/Costs;
          // var ConvRateString = ConvRate.setNumberFormat("0.00");
          Logger.log('the clicks are: ' + Clicks + " the % Conv is: " + ConvRate);
          //calc cpa
          var Cpa = Costs/Transactions;
          //calc cpc
          var Cpc = Costs/Clicks;
        }
        var ConvRateCell = mySheet.getRange([i+1],[6]).setNumberFormat("%0.00");
        ConvRateCell.setValue(ConvRate);
        var CpaCell = mySheet.getRange([i+1],[7]).setNumberFormat("$0.00");
        CpaCell.setValue(Cpa);
        var CpcCell = mySheet.getRange([i+1],[8]).setNumberFormat("$0.00");
        CpcCell.setValue(Cpc);
        var RoasCell = mySheet.getRange([i+1],[9]).setNumberFormat("%0.00");
        RoasCell.setValue(ROAS);
      }
    }
    
  }