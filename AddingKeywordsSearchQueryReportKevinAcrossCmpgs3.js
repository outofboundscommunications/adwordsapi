// JavaScript Document// Minimum number of data points and conversions for a keyword to consider 'enough data'
// and to make an educated decision
 var CONVERSION_THRESHOLD = 1;
 var IMPRESSION_THRESHOLD = 3;
// If our conversion cost isn't too high, it'll become a positive keyword.
var COST_PER_CONVERSION_THRESHOLD = 30; // $30
// needs to be a query found from an active campaign and ad group
var CAMPAIGN_STATUS= "ACTIVE";
var ADGROUP_STATUS = "ENABLED";

function main() {
  //to ensure we don't add any keywords that already exist, collect all tkeywords that each active ad group already has
  //create object to store current active keywords
  var keywordsInAdGroups = {};
  //run keyword report to fetch all current active keywords in account.
  var report = AdWordsApp.report(
    "SELECT AdGroupId, KeywordText " +
    "FROM   KEYWORDS_PERFORMANCE_REPORT " +
    "WHERE CampaignStatus = ACTIVE " +
    "AND  AdGroupStatus = ENABLED " +
    "DURING TODAY");
  //and add them to the keyword object array
  var rows = report.rows();
  while (rows.hasNext()) {
    var row = rows.next();
    addToMultiMap(keywordsInAdGroups, row['AdGroupId'], row['KeywordText']);
  }
  Logger.log(keywordsInAdGroups);

  
  //now we run a SQR report for any queries
  //that meet our performance criteria (see above at top)
   var mySQRreport = AdWordsApp.report(
      "SELECT Query,MatchType, Impressions, Clicks,Cost,Ctr,ConversionRate,CostPerConversion,Conversions,CampaignId,AdGroupId, CampaignName,AdGroupName " +
      "FROM SEARCH_QUERY_PERFORMANCE_REPORT " +
     "WHERE " +
          " Conversions = " + CONVERSION_THRESHOLD +
		  " AND Impressions > " + IMPRESSION_THRESHOLD +
      " DURING LAST_30_DAYS");
   
  var rows = mySQRreport.rows();
  
  //define object to store all the new keywords from SQR we are going to add
  var positiveKeywords = {};
  //define object to hold all the adgroup IDs that have queries from SQR meeting performance criteria
  var allAdGroupIds = {};
  var myMatchTypes = ['phrase','exact', 'PHRASE', 'EXACT'];
  
   // Iterate through search query report results, row by row and decide whether to
   // add them as positive keywords (or ignore).
   while (rows.hasNext()) {
      var row = rows.next();
      //if the CPA meets our criteria
	  if (parseFloat(row['CostPerConversion']) < COST_PER_CONVERSION_THRESHOLD)	{
	  	//and if the match type of the query meets our criteria
		if (row['MatchType'].indexOf(myMatchTypes) != -1)	{ 
			//then we want to add this query as a new positive keyword to the account
			//store that query's parent ad group Id and the query itself
			addToMultiMap(positiveKeywords, row['AdGroupId'], row['Query']);
			Logger.log("the ad group id where the query was found is: " + row['AdGroupId'] + 
				" the ad group name is: " + row['AdGroupName'] +
				" the cmpg name is: " + row['CampaignName'] +
				
				" the query is: " + row['Query'] +
				" the match type is: " + row['MatchType'] + 
				" the impressions were: " + row['Impressions'] +
				 " and the cpa is: " + row['CostPerConversion']);
			//set all these adgroup IDs to true
			allAdGroupIds[row['AdGroupId']] = true;
		}
    }
  }
  
  // Copy all the adGroupIds from the object into an array.
  var adGroupIdList = [];
  for (var adGroupId in allAdGroupIds) {
    adGroupIdList.push(adGroupId);
  }
  // Now add the keywords as exact match positives to the ad group they were found in, first making
  // sure those keywords don't already exist anywhere in account
  // fetch all the ad groups where we found positive keywords
  var adGroups = AdWordsApp.adGroups().withIds(adGroupIdList).get();
  while (adGroups.hasNext()) {
    var adGroup = adGroups.next();
    if (positiveKeywords[adGroup.getId()]) {
      for (var i = 0; i < positiveKeywords[adGroup.getId()].length; i++) {
        //here is where we check for any existing keywords, if not, then add keyword to that ad group id
        //where the query was found
        if (keywordsInAdGroups[adGroup.getId()] &&
           keywordsInAdGroups[adGroup.getId()].indexOf(positiveKeywords[adGroup.getId()][i]) == -1) {
          // create keyword
          Logger.log("I am going to add this keyword: " + positiveKeywords[adGroup.getId()][i]);
          adGroup.createKeyword('[' + positiveKeywords[adGroup.getId()][i] + ']');
        }
      }
    }
  }
  
  
}

function addToMultiMap(map, key, value) {
  if (!map[key]) {
    map[key] = [];
  }
  map[key].push(value);
}