// Minimum number of impressions for a query to consider 'enough data'
// and to make an educated decision
 var IMPRESSION_THRESHOLD = 0;

// needs to be a query found from an active campaign and ad group
var CAMPAIGN_STATUS= "ACTIVE";
var ADGROUP_STATUS = "ENABLED";

// Comma-separated list of recipients.
var RECIPIENT_EMAIL = 'jayw@outofboundscommunications.com'; 'danielf.kim@gmail.com';
// Spreadsheet template.
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheet/ccc?key=0Aofty_0xxQLJdE41V004M1JOMnYzUEZzdHVfM3dHWVE#gid=0';

function main() {
 
  //define array of query objects
  var queries =[];
  
  //create query object constructor
  function SearchQuery(AdGroupName,CampaignName,Keyword, MatchType,Query,Clicks,Impressions,Conversions,CostPerConversion,ConversionRate) {
    this.AdGroupName = AdGroupName;
    this.CampaignName = CampaignName;
    this.Keyword = Keyword;
    this.MatchType = MatchType;
    this.Query = Query;
    this.Clicks = Clicks;
    this.Impressions = Impressions;
    this.Costs = Costs;
    this.Conversions = Conversions;
    this.CostPerConversion = CostPerConversion;
    this.ConversionRate = ConversionRate;
  }
  
    var report = AdWordsApp.report(
      "SELECT AdGroupName, CampaignName, KeywordTextMatchingQuery,MatchType,Query, Clicks,Impressions, Cost,Conversions,CostPerConversion,ConversionRate " +
      "FROM   SEARCH_QUERY_PERFORMANCE_REPORT " +
      "WHERE Impressions > " + IMPRESSION_THRESHOLD +
      " DURING LAST_30_DAYS");
  
  var rows = report.rows();
  while (rows.hasNext()) {
    var row = rows.next();
    var AdGroupName = row['AdGroupName'];
    var CampaignName = row['CampaignName'];
    var Keyword = row['KeywordTextMatchingQuery'];
    var MatchType = row['MatchType'];
    var Query = row['Query'];
    var Clicks = row['Clicks'];
    var Impressions = row['Impressions'];
    var Costs = row['Cost'];
    var Conversions = row['Conversions'];
    var CostPerConversion = row['CostPerConversion'];
    var ConversionRate = row['ConversionRate'];
    var myQueryItem = new SearchQuery(AdGroupName,CampaignName,Keyword, MatchType,Query,Clicks,Impressions,Costs,Conversions,CostPerConversion,ConversionRate);
    queries.push(myQueryItem);
  }
  Logger.log(queries);
  for (i=0; i<queries.length; i++){
    Logger.log("Query: " + queries[i].Query + " CampaignName: " + queries[i].CampaignName + " CPA: " + queries[i].CostPerConversion);
  }
  
  var now = new Date();
  var reportName = "Last30Days-" + Utilities.formatDate(now, "CST", "yyyyMMdd");
  //open spreadsheet by url
  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  // insert new sheet named with reportName.
  var sheet = spreadsheet.insertSheet(reportName);
  // Write header row.
  sheet.getRange("A1").setValue("AdGroupName");
  sheet.getRange("B1").setValue("CampaignName");
  sheet.getRange("C1").setValue("Keyword");
  sheet.getRange("D1").setValue("MatchType");
  sheet.getRange("E1").setValue("Query");
  sheet.getRange("F1").setValue("Impressions");
  sheet.getRange("G1").setValue("Clicks");
  sheet.getRange("H1").setValue("Conversions");
  sheet.getRange("I1").setValue("CostPerConversion");
  sheet.getRange("J1").setValue("ConversionRate");

  // Write body of report.
  for (i=0; i < queries.length; i++) {
    var row = i+2;
    sheet.getRange("A" + row).setValue(queries[i].AdGroupName);
    sheet.getRange("B" + row).setValue(queries[i].CampaignName);
    sheet.getRange("C" + row).setValue(queries[i].Keyword);
    sheet.getRange("D" + row).setValue(queries[i].MatchType);
    sheet.getRange("E" + row).setValue(queries[i].Query);
    sheet.getRange("F" + row).setValue(queries[i].Impressions);
    sheet.getRange("G" + row).setValue(queries[i].Clicks);
	sheet.getRange("H" + row).setValue(queries[i].Conversions);
    sheet.getRange("I" + row).setValue(queries[i].CostPerConversion);
    sheet.getRange("J" + row).setValue(queries[i].ConversionRate);
  }
//send email to notify user report is ready
  
  if (RECIPIENT_EMAIL)  {
     MailApp.sendEmail(RECIPIENT_EMAIL, 'New Search Query Report for Eye Associates is ready.', spreadsheet.getUrl());
  }
//log notifications to console
  
  Logger.log("Report ready! Visit the following URL to see it:");
  Logger.log("https://docs.google.com/spreadsheet/ccc?key=" + spreadsheet.getId());

}