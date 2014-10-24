//finds keywords whose average position is too low, and increases their bids.

// Ad position we are trying to achieve.
var TARGET_AVERAGE_POSITION = 2;

// Once the keywords fall within TOLERANCE of TARGET_AVERAGE_POSITION,
// their bids will no longer be adjusted.
var TOLERANCE = 0.1;

// How much to adjust the bids.
var BID_ADJUSTMENT_COEFFICIENT = 1.02;

function main() {
  // Get the EA account by ID
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
    //NOTE: added by jay wilner 10.8.2014 - turn on the bid adjustment downward
    lowerKeywordBids();
  }
  
}
  
  function raiseKeywordBids()  {
    // Condition to raise bid: Average position is below target - tolerance
    var keywordsToRaise = AdWordsApp.keywords()
    // select only from enabled campaigns
    .withCondition("CampaignStatus = ENABLED")
    // select only enabled keywords
    .withCondition("Status = ENABLED")
     //select only non-brand keywords
    .withCondition("LabelNames CONTAINS_NONE ['brand-keyword']")
    .withCondition("AveragePosition > " + (TARGET_AVERAGE_POSITION + TOLERANCE))
    .orderBy("AveragePosition ASC")
    .forDateRange("LAST_7_DAYS")
    .get();
    
    // Log number of keywords in object
    Logger.log("the number of keywords to raise bids on is: " + keywordsToRaise.totalNumEntities());
    
    while (keywordsToRaise.hasNext()) {
      var keyword = keywordsToRaise.next();
      //get stats for keyword
      var stats = keyword.getStatsFor("LAST_7_DAYS");
      keyword.setMaxCpc(keyword.getMaxCpc() * BID_ADJUSTMENT_COEFFICIENT);
      Logger.log('keyword is: ' + keyword.getText() + ' current position is: ' + stats.getAveragePosition());
    }
  }

function lowerKeywordBids() {
  // Conditions to lower bid: Ctr greater than 1% AND
  // average position above target + tolerance
  var keywordsToLower = AdWordsApp.keywords()
     // select only from enabled campaigns
    .withCondition("CampaignStatus = ENABLED")
    //select only non-brand keywords
    .withCondition("LabelNames CONTAINS_NONE ['brand-keyword']")
    //.withCondition("Ctr > 0.01")
    .withCondition("AveragePosition < " + (TARGET_AVERAGE_POSITION - TOLERANCE))
    .withCondition("Status = ENABLED")
    .orderBy("AveragePosition DESC")
    .forDateRange("LAST_7_DAYS")
    .get();

   // Log number of keywords in object
    Logger.log("the number of keywords to lower bids on is: " + keywordsToLower.totalNumEntities());
  
  while (keywordsToLower.hasNext()) {
    var keyword = keywordsToLower.next();
     //get stats for keyword
      var stats = keyword.getStatsFor("LAST_7_DAYS");
    keyword.setMaxCpc(keyword.getMaxCpc() / BID_ADJUSTMENT_COEFFICIENT);
     Logger.log('keyword is: ' + keyword.getText() + ' current position is: ' + stats.getAveragePosition());
  }
}