//this script creates a month to date (MTD) campaign level report for the freedom furniture acct
//and appends the new campaign level records to the desired google sheet

// Comma-separated list of recipients.
var RECIPIENT_EMAIL_1 = 'jayw@outofboundscommunications.com';
var RECIPIENT_EMAIL_2 = 'aschleifer@freedomfe.com';
var RECIPIENT_EMAIL_3 = 'yasminahmed.ppc@gmail.com';

// Spreadsheet template.
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1HFcpYdKnmaH4WHf7ppzw_3-XLr7SFxk4EpgsvFK-JeU/edit?usp=sharing';

function main() {
  //define array of query objects
  var myCampaignArray =[];
    // Get the EA account by ID
  var accountSelector = MccApp.accounts()
    .withIds(['541-276-8874']);
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
		 
  		 //create a variable for today to time stamp when we ran report
          var today = new Date();
          today.setDate(today.getDate());
          Logger.log(today);
		  
		  //open spreadsheet by url
		  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
		  // fetch the sheet for cmpg report
		  var sheet = spreadsheet.getSheetByName('CmpgReportMTD');
		  //clear contents of sheet while preserving formatting
		  sheet.clearContents();
		  
		   // Write header row.
		  sheet.getRange("A1").setValue("Reporting Date");
		  sheet.getRange("B1").setValue("Campaign Name");
		  sheet.getRange("C1").setValue("Campaign Status");
		  sheet.getRange("D1").setValue("Clicks");
		  sheet.getRange("E1").setValue("Click Type");
		  sheet.getRange("F1").setValue("Impressions");
		  sheet.getRange("G1").setValue("Ctr");
		  sheet.getRange("H1").setValue("Average Cpc");
		  sheet.getRange("I1").setValue("Cost");
		  sheet.getRange("J1").setValue("Average Position");
		  sheet.getRange("K1").setValue("Conversions");
		  sheet.getRange("L1").setValue("Conversion Rate");
		  sheet.getRange("M1").setValue("Cost Per Conversion");
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
	  //send email to notify user report is ready
    
    if (RECIPIENT_EMAIL_1)  {
      MailApp.sendEmail(RECIPIENT_EMAIL_1, 'New AdWords Campaign Performance Report for Freedom MTD is ready.', spreadsheet.getUrl());
     }
    
    if (RECIPIENT_EMAIL_2)  {
      MailApp.sendEmail(RECIPIENT_EMAIL_2, 'New AdWords Campaign Performance Report for Freedom MTD is ready.', spreadsheet.getUrl());
     }
	 if (RECIPIENT_EMAIL_3)  {
      MailApp.sendEmail(RECIPIENT_EMAIL_3, 'New AdWords Campaign Performance Report for Freedom MTD is ready.', spreadsheet.getUrl());
     }


  //log notifications to console
	  Logger.log("Report ready! Visit the following URL to see it:");
	  Logger.log("https://docs.google.com/spreadsheet/ccc?key=" + spreadsheet.getId());
	}
}