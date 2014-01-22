//what we want to do now is get this script to run on a scheduled basis and label
//keywords that meet/exceed perf. criteria with the label "top-performers"

//define our performance criteria
var CONVERSION_THRESHOLD = 1;
var COST_PER_CONVERSION_THRESHOLD = 45; // $45

var LABEL = 'top-performing-keyword';

// Comma-separated list of recipients for email notification.
var RECIPIENT_EMAIL = 'jayw@outofboundscommunications.com';
// Spreadsheet template.
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheet/ccc?key=0Ary0DJryRVSpdDBwdkYxLXdpNDhKRWNNUC1IZFVtd1E&usp=sharing';

function main() {
  //define array of keywords objects where we store keywords meeting perf. criteria that we labeled. we write these to the worksheet.
   var keywords =[];
   
  //create keyword object constructor
  function KeywordPerformance(AdGroupName,CampaignName,KeywordText,Clicks,Impressions,Costs,Conversions,CostPerConversion,ConversionRate,KeywordId) {
		this.AdGroupName = AdGroupName;
		this.CampaignName = CampaignName;
		this.KeywordText = KeywordText;
		this.Clicks = Clicks;
		this.Impressions = Impressions;
		this.Costs = Costs;
		this.Conversions = Conversions;
		this.CostPerConversion = CostPerConversion;
		this.ConversionRate = ConversionRate;
		this.KeywordId = KeywordId;
	}
  //create the label
  createLabels();
  //fetch keyword report, label performers
   getKeywordReport();
	//label the top performers
   labelKeywords();
   //record results to worksheet
   storeResults(keywords);
}

// labeling function, run once to create labels
function createLabels() {
  AdWordsApp.createLabel('top-performing-keyword', 'Keywords that are exceeding our performance criteria', 'green');
}

// Returns true if the keyword already has the top performer label applied.
function hasLabel(KeywordText, LABEL) {
  return keyword.labels().withCondition("Name = '" + label + "'").get().hasNext();
}
  
function getKeywordReport()	{
//create keyword performance report
  var report = AdWordsApp.report(
	  "SELECT AdGroupName, CampaignName, KeywordText, Clicks,Impressions, Cost,Conversions,CostPerConversion,ConversionRate " +
	  "FROM   KEYWORDS_PERFORMANCE_REPORT " +
	  "WHERE Conversions > " + CONVERSION_THRESHOLD +
	  " DURING LAST_30_DAYS");

	 var rows = report.rows();
	  while (rows.hasNext()) {
		var row = rows.next();
		var AdGroupName = row['AdGroupName'];
		var CampaignName = row['CampaignName'];
		var KeywordText = row['KeywordText'];
		var Clicks = row['Clicks'];
		var Impressions = row['Impressions'];
		var Costs = row['Cost'];
		var Conversions = row['Conversions'];
		var CostPerConversion = row['CostPerConversion'];
		var ConversionRate = row['ConversionRate'];
		var KeywordId = row['Id'];
		//if keyword meets our performance criteria
		if (CostPerConversion < COST_PER_CONVERSION_THRESHOLD && Conversions > CONVERSION_THRESHOLD){
			//push the keyword to the keyword array so we can then label it and record to the spreadsheet
			var myKeywordItem = new KeywordPerformance(AdGroupName,CampaignName,KeywordText,Clicks,Impressions,Costs,Conversions,CostPerConversion,ConversionRate,KeywordId);
			keywords.push(myKeywordItem);
		}
	  }
}

function labelKeywords(keywords)	{
	for (i=1;i<=[keywords].length;i++)	{
		KeywordText.apply
	
}
function storeResults(keywords)	{
	  var now = new Date();
	  var reportName = "TopPerformers-" + Utilities.formatDate(now, "CST", "yyyyMMdd");
	  //open spreadsheet by url
	  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
	  // insert new sheet named with reportName.
	  var sheet = spreadsheet.insertSheet(reportName);
	  // Write header row.
	  sheet.getRange("A1").setValue("AdGroupName");
	  sheet.getRange("B1").setValue("CampaignName");
	  sheet.getRange("C1").setValue("KeywordText");
	  sheet.getRange("D1").setValue("Impressions");
	  sheet.getRange("E1").setValue("Clicks");
	  sheet.getRange("F1").setValue("Conversions");
	  sheet.getRange("G1").setValue("CostPerConversion");
	  sheet.getRange("H1").setValue("ConversionRate");
	  sheet.getRange("I1").setValue("Label");
	
	  // Write body of report.
	  for (i=0; i < keywords.length; i++) {
		var row = i+2;
		sheet.getRange("A" + row).setValue(keywords[i].AdGroupName);
		sheet.getRange("B" + row).setValue(keywords[i].CampaignName);
		sheet.getRange("C" + row).setValue(keywords[i].KeywordText);
		sheet.getRange("D" + row).setValue(keywords[i].Impressions);
		sheet.getRange("E" + row).setValue(keywords[i].Clicks);
		sheet.getRange("F" + row).setValue(keywords[i].Conversions);
		sheet.getRange("G" + row).setValue(keywords[i].CostPerConversion);
		sheet.getRange("H" + row).setValue(keywords[i].ConversionRate);
		sheet.getRange("I" + row).setValue(keywords[i].Label);
		
	  }
	//send email to notify user report is ready
	  
	  MailApp.sendEmail(
		RECIPIENT_EMAIL, 'New Top Performing Labeling Report for ShopFreedom.Com is ready.', spreadsheet.getUrl());
	//log notifications to console
	  
	  Logger.log("Report ready! Visit the following URL to see it:");
	  Logger.log("https://docs.google.com/spreadsheet/ccc?key=" + spreadsheet.getId());
	  
}