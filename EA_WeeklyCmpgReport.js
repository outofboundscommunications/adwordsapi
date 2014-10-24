//this script creates a weekly campaign level report

// Comma-separated list of recipients.
var RECIPIENT_EMAIL = 'jayw@outofboundscommunications.com';
// Spreadsheet template.
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1WpqdJOpdxUlDXNgqpgQq7Zgi1U8GxjnQy5egG-u5YMc/edit?usp=sharing';

function main() {
 
  //define array of query objects
  var myCampaignArray =[];
  
  //create campaign object constructor
  function Campaign(CampaignName,CampaignStatus,Clicks,AverageCpc,Impressions,Ctr,ClickType,Costs,Conversions,CostPerConversion,ConversionRate) {
    this.CampaignName = CampaignName;
    this.CampaignStatus=CampaignStatus;
    this.Clicks = Clicks;
    this.AverageCpc = AverageCpc;
    this.Impressions = Impressions;
    this.Ctr = Ctr;
    this.ClickType = ClickType;
    this.Costs = Costs;
    this.Conversions = Conversions;
    this.CostPerConversion = CostPerConversion;
    this.ConversionRate = ConversionRate;
  }
  
  //create campaign report selector
  
    var report = AdWordsApp.report(
      "SELECT CampaignName, CampaignStatus,Clicks,Ctr,AverageCpc,Impressions, ClickType,Cost,Conversions,CostPerConversion,ConversionRate " +
      "FROM   CAMPAIGN_PERFORMANCE_REPORT " +
     // "WHERE CampaignName CONTAINS_IGNORE_CASE 'calendar'"+
      " DURING LAST_7_DAYS");
  
  var rows = report.rows();
  while (rows.hasNext()) {
    var row = rows.next();
    var CampaignName =row['CampaignName'];
    var CampaignStatus = row['CampaignStatus'];
    var Clicks = row['Clicks'];
    var Ctr = row['Ctr'];
    var AverageCpc = row['AverageCpc'];
    var Impressions = row['Impressions'];
    var ClickType = row['ClickType'];
    var Costs = row['Cost'];
    var Conversions = row['Conversions'];
    var CostPerConversion = row['CostPerConversion'];
    var ConversionRate = row['ConversionRate'];
    //add items to array
      var myCampaignItem = new Campaign(CampaignName,CampaignStatus,Clicks,AverageCpc,Impressions,Ctr,ClickType,Costs,Conversions,CostPerConversion,ConversionRate);
      myCampaignArray.push(myCampaignItem);

  }
  Logger.log(myCampaignArray);
  for (i=0; i<myCampaignArray.length; i++){
    Logger.log("Campaign " + myCampaignArray[i].CampaignName + " Click Type: " + myCampaignArray[i].ClickType + " Clicks: " + myCampaignArray[i].Clicks);
  }
  
  
 var Last7Ending = getDateInThePast(1);
  Logger.log(Last7Ending);
  //open spreadsheet by url
  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  // fetch the sheet for cmpg perf last 7 days
  var sheet = spreadsheet.getSheetByName('camp_perf_7_days');
  Logger.log(sheet.getName());
  
  var lastRow = sheet.getLastRow();
  Logger.log('last row is'+ lastRow);
 
  //write to sheet
  for (var i = 0; i < myCampaignArray.length; i++) {
    sheet.appendRow([Last7Ending,myCampaignArray[i].CampaignName, myCampaignArray[i].CampaignStatus,
                    myCampaignArray[i].Clicks,myCampaignArray[i].Ctr,myCampaignArray[i].AverageCpc,
                    myCampaignArray[i].Impressions,myCampaignArray[i].ClickType,
                    myCampaignArray[i].Costs,myCampaignArray[i].Conversions,myCampaignArray[i].CostPerConversion,
                    myCampaignArray[i].ConversionRate]);
}

// Returns YYYYMMDD-formatted date.
function getDateInThePast(numDays) {
  var today = new Date();
  today.setDate(today.getDate() - numDays);
  return Utilities.formatDate(today, 'CST', 'MMddyyyy');
}
  
  //send email to notify user report is ready
  
 MailApp.sendEmail(
   RECIPIENT_EMAIL, 'New Campaign Report for Eye Associates is ready.', spreadsheet.getUrl());

  //log notifications to console

  
  Logger.log("Report ready! Visit the following URL to see it:");
  Logger.log("https://docs.google.com/spreadsheet/ccc?key=" + spreadsheet.getId());


}