//this script creates a month to date (MTD) campaign level report for the eye associates account
//and appends the new campaign level records to the desired google sheet

// Comma-separated list of recipients.
var RECIPIENT_EMAIL = 'jayw@outofboundscommunications.com';
// Spreadsheet template.
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1WpqdJOpdxUlDXNgqpgQq7Zgi1U8GxjnQy5egG-u5YMc/edit?usp=sharing';

function main() {
  //define array of query objects
  var myCampaignArray =[];
    // Get the EA account by ID
  var accountSelector = MccApp.accounts()
    .withIds(['562-138-7680']);
  	// Get current account I want
  	var accountIterator = accountSelector.get();
  	// Iterate thru the accounts (only one here)
  	while (accountIterator.hasNext())  {
    	var account = accountIterator.next();
    	// Select the client account to operate on.
    	MccApp.select(account)
		  //create campaign object constructor
		  function Campaign(CampaignName,CampaignStatus,Clicks,ClickType,Impressions,Ctr,AverageCpc,Cost,AveragePosition,Conversions,ConversionRate,CostPerConversion) {
			this.CampaignName = CampaignName;
			this.CampaignStatus=CampaignStatus;
			this.Clicks = Clicks;
			this.ClickType = ClickType;
			this.Impressions = Impressions;
			this.Ctr = Ctr;
			this.AverageCpc = AverageCpc;
			this.Cost = Cost;
			this.AveragePosition = AveragePosition;
			this.Conversions = Conversions;
			this.ConversionRate = ConversionRate;
			this.CostPerConversion = CostPerConversion;
		  }
	  //create campaign report selector
	  //select data for this month to date
		var report = AdWordsApp.report(
		  "SELECT CampaignName,CampaignStatus,Clicks,ClickType,Impressions,Ctr,AverageCpc,Cost,AveragePosition,Conversions,ConversionRate,CostPerConversion " +
		  "FROM   CAMPAIGN_PERFORMANCE_REPORT " +
		 // "WHERE CampaignName CONTAINS_IGNORE_CASE 'calendar'"+
		  " DURING THIS_MONTH");
 
  		var rows = report.rows();
		  while (rows.hasNext()) {
			var row = rows.next();
			var CampaignName =row['CampaignName'];
			var CampaignStatus = row['CampaignStatus'];
			var Clicks = row['Clicks'];
			var ClickType = row['ClickType'];
			var Impressions = row['Impressions'];
			var Ctr = row['Ctr'];
			var AverageCpc = row['AverageCpc'];
			var Cost = row['Cost'];
			var AveragePosition = row['AveragePosition'];
			var Conversions = row['Conversions'];
			var ConversionRate = row['ConversionRate'];
			var CostPerConversion = row['CostPerConversion'];
			//add items to array
			  var myCampaignItem = new Campaign(CampaignName,CampaignStatus,Clicks,ClickType,Impressions,Ctr,AverageCpc,Cost,AveragePosition,
			  Conversions,ConversionRate,CostPerConversion);
			  myCampaignArray.push(myCampaignItem);
		
		  }
		  Logger.log(myCampaignArray);
		  for (i=0; i<myCampaignArray.length; i++){
			Logger.log("Campaign " + myCampaignArray[i].CampaignName + " Click Type: " + myCampaignArray[i].ClickType + " Clicks: " + myCampaignArray[i].Clicks);
		  }
  		 //create a variable for today to time stamp when we ran report
          var today = new Date();
          today.setDate(today.getDate());
          Logger.log(today);
		  
		  //open spreadsheet by url
		  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
		  // fetch the sheet for cmpg perf last 7 days
		  var sheet = spreadsheet.getSheetByName('camp_perf_mtd');
		  //clear contents of sheet while preserving formatting
		  sheet.clearContents();
		  //write to sheet
		  for (var i = 0; i < myCampaignArray.length; i++) {
			var row = i+2;
			  	sheet.getRange("A" + row).setValue(today);
                sheet.getRange("B" + row).setValue(myCampaignArray[i].CampaignName);
				sheet.getRange("C" + row).setValue(myCampaignArray[i].CampaignStatus);
				sheet.getRange("D" + row).setValue(myCampaignArray[i].Clicks);
				sheet.getRange("E" + row).setValue(myCampaignArray[i].ClickType);
				sheet.getRange("F" + row).setValue(myCampaignArray[i].Impressions);
				sheet.getRange("G" + row).setValue(myCampaignArray[i].Ctr);
				sheet.getRange("H" + row).setValue(myCampaignArray[i].AverageCpc);
				sheet.getRange("I" + row).setValue(myCampaignArray[i].Cost);
				sheet.getRange("J" + row).setValue(myCampaignArray[i].AveragePosition);
				sheet.getRange("K" + row).setValue(myCampaignArray[i].Conversions);
				sheet.getRange("L" + row).setValue(myCampaignArray[i].ConversionRate);
				sheet.getRange("M" + row).setValue(myCampaignArray[i].CostPerConversion);
		}
  //send email to notify user report is ready
	 //MailApp.sendEmail(
	  // RECIPIENT_EMAIL, 'New Campaign Report for Eye Associates is ready.', spreadsheet.getUrl());

  //log notifications to console
	  Logger.log("Report ready! Visit the following URL to see it:");
	  Logger.log("https://docs.google.com/spreadsheet/ccc?key=" + spreadsheet.getId());
	}
}