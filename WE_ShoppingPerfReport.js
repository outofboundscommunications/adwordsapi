//this script creates a shopping cmpg report

// Spreadsheet template.
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1Mgmol1e5GaDfbq-vBVqftu9K_Hfklwtto1LX2aMojXQ/edit?usp=sharing';

function main() {
  //define array of query objects
  var myCampaignArray =[];
    // Get the Wake effects account by ID
  var accountSelector = MccApp.accounts()
    .withIds(['340-002-3971']);
  	// Get current account I want
  	var accountIterator = accountSelector.get();
  	// Iterate thru the accounts (only one here)
  	while (accountIterator.hasNext())  {
    	var account = accountIterator.next();
    	// Select the client account to operate on.
    	MccApp.select(account)
		  //create campaign object constructor
		  function Campaign(CampaignName,Brand,ProductTypeL1,CustomAttribute3,MyDate,Clicks,Impressions,Cost,Conversions,SearchClickShare,SearchImpressionShare) {
			this.CampaignName = CampaignName;
			this.Brand = Brand;
      this.ProductTypeL1 = ProductTypeL1;
      this.CustomAttribute3 = CustomAttribute3;
      this.MyDate = MyDate;
			this.Clicks = Clicks;
			this.Impressions = Impressions;
			this.Cost = Cost;
			this.Conversions = Conversions;
			this.SearchClickShare = SearchClickShare;
			this.SearchImpressionShare = SearchImpressionShare;
		  }
	  //create shopping report selector
	  //select data for this month to date
		var report = AdWordsApp.report(
		  "SELECT CampaignName,Brand,ProductTypeL1,CustomAttribute3,MyDate,Clicks,Impressions,Cost,Conversions,SearchClickShare,SearchImpressionShare " +
		  "FROM   SHOPPING_PERFORMANCE_REPORT " +
		  " DURING LAST_30_DAYS");

  		var rows = report.rows();
		  while (rows.hasNext()) {
            var row = rows.next();
            var CampaignName =row['CampaignName'];
            var Brand = row['Brand'];
            var ProductTypeL1 =row['ProductTypeL1'];
            var CustomAttribute3 =row['CustomAttribute3'];
            var MyDate = row['Date'];
            var Clicks = row['Clicks'];
            var Impressions = row['Impressions'];
            var Cost = row['Cost'];
            var Conversions = row['Conversions'];
            var SearchClickShare = row['SearchClickShare'];
            var SearchImpressionShare = row['SearchImpressionShare'];
            //add row of data to array
            var myCampaignItem = new Campaign(CampaignName,Brand,ProductTypeL1,CustomAttribute3,,MyDate,Clicks,Impressions,Cost,Conversions,SearchClickShare,SearchImpressionShare);
            myCampaignArray.push(myCampaignItem);
      }
      //Log header row
      Logger.log("Date,Campaign,Brand,ProductTypeL1,Clicks,SearchClickShare,SearchImpressionShare");
      //Log data to screen
      for (i=0; i<myCampaignArray.length; i++){
  			Logger.log(
          myCampaignArray[i].MyDate + "," +
          myCampaignArray[i].CampaignName + "," +
          myCampaignArray[i].Brand + "," +
          myCampaignArray[i].ProductTypeL1 + "," +
          myCampaignArray[i].Clicks + "," +
          myCampaignArray[i].SearchClickShare + "," +
          myCampaignArray[i].SearchImpressionShare
          );
		  }
      var Last30Ending = getDateInThePast(1);
       Logger.log(Last30Ending);
       //open spreadsheet by url
       var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
       // fetch the sheet for cmpg perf last 7 days
       var sheet = spreadsheet.getSheetByName('myShoppingData');
       Logger.log(sheet.getName());
       var lastRow = sheet.getLastRow();
       Logger.log('last row is'+ lastRow);
       //write to sheet
       for (var i = 0; i < myCampaignArray.length; i++) {
         sheet.appendRow([
           Last30Ending,
           myCampaignArray[i].MyDate,
           myCampaignArray[i].CampaignName,
           myCampaignArray[i].Brand,
           myCampaignArray[i].ProductTypeL1,
           myCampaignArray[i].Clicks,
           myCampaignArray[i].SearchClickShare,
           myCampaignArray[i].SearchImpressionShare]);
     }
     // Returns YYYYMMDD-formatted date.
     function getDateInThePast(numDays) {
       var today = new Date();
       today.setDate(today.getDate() - numDays);
       return Utilities.formatDate(today, 'CST', 'MMddyyyy');
     }
	}
}
