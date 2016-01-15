//finds keywords whose average position is too low, and increases their bids.

// Spreadsheet template where we write the bid changes.
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1g4UKvlDqjQxjcqL_HkyAUgtNDVlvMvMsQvcYN0quBJ4/edit?usp=sharing';

// Ad position we are trying to achieve.
var TARGET_AVERAGE_POSITION = 4;

// Once the keywords fall within TOLERANCE of TARGET_AVERAGE_POSITION,
// their bids will no longer be adjusted.
var TOLERANCE = 0.2;

// How much to adjust the bids.
var BID_ADJUSTMENT_COEFFICIENT = 1.03;

//create constructor to hold bid/keyword object

function BidChange(CampaignName,AdGroupName,Text,MaxCpc,QualityScore,TopOfPageCpc,Impressions,Clicks,AveragePosition,AverageCpc,BidType)	{
	this.CampaignName = CampaignName;
	this.AdGroupName = AdGroupName;
	this.Text = Text;
	this.MaxCpc = MaxCpc;
	this.QualityScore = QualityScore;
	this.TopOfPageCpc = TopOfPageCpc;
	this.Impressions = Impressions;
	this.Clicks = Clicks;
	this.AveragePosition = AveragePosition;
	this.AverageCpc = AverageCpc;
	this.BidType = BidType;
	}

//define array of BidChanges objects
var bidChangesArray =[];

//start main function /////
function main() {
  // Get an account
  var accountSelector = MccApp.accounts()
    .withIds(['562-138-7680']);
  
  // Get current account I want
  var accountIterator = accountSelector.get();
  // Iterate thru the accounts (only one here)
  while (accountIterator.hasNext())  {
    var account = accountIterator.next();
    // Select the client account to operate on.
    MccApp.select(account);
    // Call function to select keywords with poor position and bid higher
    raiseKeywordBids();
    // Call function to select keywords with good position and bid lower
    lowerKeywordBids();
	//call function to write bid changes to sheet
	writeBidChanges();
  }
}

//end main function /////

//raise keywords bid function
  function raiseKeywordBids()  {
    // Condition to raise bid: Average position is below target - tolerance
    var keywordsToRaise = AdWordsApp.keywords()
    // select only from enabled campaigns
    .withCondition("CampaignStatus = ENABLED")
    // select only enabled keywords
    .withCondition("Status = ENABLED")
    .withCondition("AveragePosition > " + (TARGET_AVERAGE_POSITION + TOLERANCE))
    .orderBy("AveragePosition ASC")
    .forDateRange("YESTERDAY")
    .get();
    
    // Log number of keywords in object
    Logger.log("the number of keywords to raise bids on is: " + keywordsToRaise.totalNumEntities());
    
    while (keywordsToRaise.hasNext()) {
      var keyword = keywordsToRaise.next();
      //get stats for keyword
      var stats = keyword.getStatsFor("LAST_7_DAYS");
	  //store the various attributes and stats of the keyword we are about to modify the bid on...
	  var myCmpgName = keyword.getCampaign().getName();
	  var myAdGrpName = keyword.getAdGroup().getName();
	  var myText = keyword.getText();
	  var myMaxCpc = keyword.getMaxCpc();
	  var myQS = keyword.getQualityScore();
	  var myTopPageCpc = keyword.getTopOfPageCpc();
	  var myImpr = stats.getImpressions();
	  var myClicks = stats.getClicks();
	  var myPos = stats.getAveragePosition();
	  var myCpc = stats.getAverageCpc();
	  //set the bid type to raise - these are keywords we bid higher
	  var myBidType = 'raise';
	  
	  //now go ahead and adjust the bid
      keyword.setMaxCpc(myMaxCpc* BID_ADJUSTMENT_COEFFICIENT);
      var newMaxCpc = myMaxCpc* BID_ADJUSTMENT_COEFFICIENT;
	  
	  //log a few of these changes
      Logger.log('keyword is: ' + myText + 'campaign is: ' + myCmpgName + 'ad group is: ' + myAdGrpName + ' current position is: ' + stats.getAveragePosition() +
        'current max cpc is: ' + myMaxCpc + ' new max cpc is: ' + newMaxCpc);
	  //store bid change in object
	  var myBidChange = new BidChange(myCmpgName,myAdGrpName,myText,newMaxCpc,myQS,myTopPageCpc,myImpr,myClicks,myPos,myCpc,myBidType);
	  // & push to array
      bidChangesArray.push(myBidChange);
    }
  }
//lower keywords bid function
  function lowerKeywordBids() {
  // Conditions to lower bid: Ctr greater than 1% AND
  // average position above target + tolerance
  var keywordsToLower = AdWordsApp.keywords()
     // select only from enabled campaigns
    .withCondition("CampaignStatus = ENABLED")
    .withCondition("AveragePosition < " + (TARGET_AVERAGE_POSITION - TOLERANCE))
    .withCondition("Status = ENABLED")
    .orderBy("AveragePosition DESC")
    .forDateRange("YESTERDAY")
    .get();

   // Log number of keywords in object
    Logger.log("the number of keywords to lower bids on is: " + keywordsToLower.totalNumEntities());
  
  while (keywordsToLower.hasNext()) {
    var keyword = keywordsToLower.next();
     //get stats for keyword
      var stats = keyword.getStatsFor("LAST_7_DAYS");
	  //store the various attributes and stats of the keyword we are about to modify the bid on...
	  var myCmpgName = keyword.getCampaign().getName();
	  var myAdGrpName = keyword.getAdGroup().getName();
	  var myText = keyword.getText();
	  var myMaxCpc = keyword.getMaxCpc();
	  var myQS = keyword.getQualityScore();
	  var myTopPageCpc = keyword.getTopOfPageCpc();
	  var myImpr = stats.getImpressions();
	  var myClicks = stats.getClicks();
	  var myPos = stats.getAveragePosition();
	  var myCpc = stats.getAverageCpc();
	  //set the bid type to lower - these are keywords we bid lower
	  var myBidType = 'lower';
	  
	  //now go ahead and adjust the bid (we divide current bid by coefficient here)
      keyword.setMaxCpc(myMaxCpc/BID_ADJUSTMENT_COEFFICIENT);
      var newMaxCpc = myMaxCpc/BID_ADJUSTMENT_COEFFICIENT;
	  
	   //log a few of these changes
      Logger.log('keyword is: ' + myText + 'campaign is: ' + myCmpgName + 'ad group is: ' + myAdGrpName + ' current position is: ' + stats.getAveragePosition() +
        'current max cpc is: ' + myMaxCpc + ' new max cpc is: ' + newMaxCpc);
	  //store bid change in object
	  var myBidChange = new BidChange(myCmpgName,myAdGrpName,myText,newMaxCpc,myQS,myTopPageCpc,myImpr,myClicks,myPos,myCpc,myBidType);
	  // & push to array
      bidChangesArray.push(myBidChange);
    }
}

//function to write changes to google sheet
function writeBidChanges()	{
  //open spreadsheet by url
  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  // fetch the sheet for storing changes
  var sheet = spreadsheet.getSheetByName('KeywordsBids');
  
   //create a variable for today to time stamp when we ran report
   var now = new Date();
   var myDate = Utilities.formatDate(now, "CST", "yyyyMMdd");
	  
  //write to sheet
  for (var i = 0; i < bidChangesArray.length; i++) {
    sheet.appendRow([myDate,bidChangesArray[i].CampaignName, bidChangesArray[i].AdGroupName,
                    bidChangesArray[i].Text,bidChangesArray[i].MaxCpc,bidChangesArray[i].QualityScore,
                    bidChangesArray[i].TopOfPageCpc,bidChangesArray[i].Impressions,
                    bidChangesArray[i].Clicks,bidChangesArray[i].AveragePosition,bidChangesArray[i].AverageCpc,
                    bidChangesArray[i].BidType]);
  }
}