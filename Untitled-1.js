//what we want to do now is get this script to run on a scheduled basis and label
//keywords that meet/exceed perf. criteria with the label "top-performers"

//define our performance criteria
var CONVERSION_THRESHOLD = 1;
var COST_PER_CONVERSION_THRESHOLD = 45; // $45

var LABEL = 'top-performing-keyword';

// Comma-separated list of recipients for email notification.
//var RECIPIENT_EMAIL = 'jayw@outofboundscommunications.com';
// Spreadsheet template.
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheet/ccc?key=0Ary0DJryRVSpdDBwdkYxLXdpNDhKRWNNUC1IZFVtd1E&usp=sharing';

function main() {
  //define array of keywords objects where we store keywords meeting perf. criteria that we labeled. we write these to the worksheet.
   var keywords =[];
   
  //create keyword object constructor
  function KeywordPerformance(AdGroupName,CampaignName,KeywordText,KeywordMatchType, KeywordId,Clicks,Impressions,Costs,Conversions,CostPerConversion,ConversionRate) {
		this.AdGroupName = AdGroupName;
		this.CampaignName = CampaignName;
		this.KeywordText = KeywordText;
        this.KeywordMatchType = KeywordMatchType;
		this.KeywordId = KeywordId;
		this.Clicks = Clicks;
		this.Impressions = Impressions;
		this.Costs = Costs;
		this.Conversions = Conversions;
		this.CostPerConversion = CostPerConversion;
		this.ConversionRate = ConversionRate;
	}
  
  //create keyword performance report
   var report = AdWordsApp.report(
	  "SELECT AdGroupName, CampaignName, KeywordText, KeywordMatchType,Id,Clicks,Impressions, Cost,Conversions,CostPerConversion,ConversionRate " +
	  "FROM   KEYWORDS_PERFORMANCE_REPORT " +
	  "WHERE Conversions > " + CONVERSION_THRESHOLD +
	  " DURING LAST_30_DAYS");

	 var rows = report.rows();
	  while (rows.hasNext()) {
		var row = rows.next();
		var AdGroupName = row['AdGroupName'];
		var CampaignName = row['CampaignName'];
		var KeywordText = row['KeywordText'];
        var KeywordMatchType = row['KeywordMatchType'];
		var KeywordId = row['Id'];
		var Clicks = row['Clicks'];
		var Impressions = row['Impressions'];
		var Costs = row['Cost'];
		var Conversions = row['Conversions'];
		var CostPerConversion = row['CostPerConversion'];
		var ConversionRate = row['ConversionRate'];
		//if keyword meets our performance criteria
		if (CostPerConversion < COST_PER_CONVERSION_THRESHOLD && Conversions > CONVERSION_THRESHOLD){
		    //Push the keyword to the keyword array so we can then record to the spreadsheet
            var myKeywordItem = new KeywordPerformance(AdGroupName,CampaignName,KeywordText,KeywordMatchType,KeywordId,Clicks,Impressions,Costs,Conversions,
                                    CostPerConversion,ConversionRate);
			keywords.push(myKeywordItem);
		}
	  }
	  
	  var now = new Date();
	  var reportName = "MyTopPerformers-" + Utilities.formatDate(now, "CST", "yyyyMMdd");
	  //open spreadsheet by url
	  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
	  // insert new sheet named with reportName.
	  var sheet = spreadsheet.insertSheet(reportName);
	  // Write header row.
	  sheet.getRange("A1").setValue("AdGroupName");
	  sheet.getRange("B1").setValue("CampaignName");
	  sheet.getRange("C1").setValue("KeywordText");
      sheet.getRange("D1").setValue("KeywordMatchType");
	  sheet.getRange("E1").setValue("KeywordId");
	  sheet.getRange("F1").setValue("Impressions");
	  sheet.getRange("G1").setValue("Clicks");
	  sheet.getRange("H1").setValue("Conversions");
	  sheet.getRange("I1").setValue("CostPerConversion");
	  sheet.getRange("J1").setValue("ConversionRate");
	
	  // Write body of report.
	  for (i=0; i < keywords.length; i++) {
		var row = i+2;
		sheet.getRange("A" + row).setValue(keywords[i].AdGroupName);
		sheet.getRange("B" + row).setValue(keywords[i].CampaignName);
		sheet.getRange("C" + row).setValue(keywords[i].KeywordText);
        sheet.getRange("D" + row).setValue(keywords[i].KeywordMatchType);
		sheet.getRange("E" + row).setValue(keywords[i].KeywordId);
		sheet.getRange("F" + row).setValue(keywords[i].Impressions);
		sheet.getRange("G" + row).setValue(keywords[i].Clicks);
		sheet.getRange("H" + row).setValue(keywords[i].Conversions);
		sheet.getRange("I" + row).setValue(keywords[i].CostPerConversion);
		sheet.getRange("J" + row).setValue(keywords[i].ConversionRate);
		
	  }
  
   //label keywords as top performers using their keyword ID
	  
	  var keywordsSelector = AdWordsApp.keywords()
		  .withCondition("CampaignStatus = ACTIVE");
          .withCondition("AdGroupStatus = ENABLED");
          .withCondition("Status = ACTIVE");
    
      var keywordIterator = keywordSelector.get();
      while (keywordIterator.hasNext(){
          var keyword = keywordIterator.next();
          if (keyword.getId).indexOf(keyword
        
  
  
  
	//send email to notify user report is ready
	  
	 // MailApp.sendEmail(
		//RECIPIENT_EMAIL, 'New Top Performing Labeling Report for ShopFreedom.Com is ready.', spreadsheet.getUrl());
	//log notifications to console
	  
	  Logger.log("Report ready! Visit the following URL to see it:");
	  Logger.log("https://docs.google.com/spreadsheet/ccc?key=" + spreadsheet.getId());

}