//we have multiple cases here for labeling keywords in campaigns, we are only labeling search campaign keywords right now.
//this script labels keywords by identifying what campaign they are in. if they are in a campaign
//with the name 'calendar' then they are labeled as: 'calendar-keyword'
//here are the various keyword labels we need:
//1. calendar keywords ('calendar-keyword') - identified as keywords within any campaign labeled as calendar - these are managed to position 2
//2. brand keywords ('brand-keyword') - identified as keywords within any campaign labeled as brand - these are managed to position 1 always
//3. search remarketing keywords - identified as keywords within any campaign labeled as search remarketing - these are managed to position 2
//4. holiday keywords ('holiday-keyword') - identified as keywords within any campaign labeled as holiday - these are managed to position 4
//5. christmas keywords - identified as keywords within any campaign labeled as christmas - these are managed to position 4

function main() {
  // Get postycards account
  var accountSelector = MccApp.accounts()
    .withIds(['265-323-3899']);
  // Get current account I want
  var accountIterator = accountSelector.get();
  // Iterate thru the accounts (only one here)
  while (accountIterator.hasNext())  {
    var account = accountIterator.next();
    // Select the client account to operate on.
    MccApp.select(account);
    //create the labels - only need to run once to create labels, then commment out
    //createLabels();
    
	//label calendar campaign keywords
    labelCalendarKeywords();
    //label the branded campaign keywords
    labelBrandedKeywords();
    //label search remarketing campaign keywords
    labelSearchRemarketingKeywords();
    //label Holiday keywords
    labelHolidayKeywords();
    //label christmas keywords
    labelChristmasKeywords();
    
  //end of accountIterator
  } 
//end of main
}

// labeling function, run once to create labels
function createLabels() {
  AdWordsApp.createLabel('brand-keyword', 'Keywords that are part of our brand', 'blue');
  AdWordsApp.createLabel('calendar-keyword', 'Keywords that are calendar campaign related', 'grey');
  AdWordsApp.createLabel('holiday-keyword', 'Keywords that are holiday campaign related', 'red');
  AdWordsApp.createLabel('search-remarketing-keyword', 'Keywords that are search remarketing campaign related', 'yellow');
  AdWordsApp.createLabel('christmas-keyword', 'Keywords that are christmas campaign related', 'green');
  
}

// Returns true if the keyword already has this label applied.

function hasLabel(keyword, label) {
  return keyword.labels().withCondition("Name = '" + label + "'").get().hasNext();
}
  
///////////// function to label keywords as branded
function labelBrandedKeywords() {
  var keywordSelector = AdWordsApp.keywords()
      //only select enabled campaigns
      .withCondition("CampaignStatus = ENABLED")
      //only select brand named campaigns
      .withCondition("CampaignName CONTAINS_IGNORE_CASE 'Brand'")
      //ignore display campaign keywords
      .withCondition("CampaignName DOES_NOT_CONTAIN_IGNORE_CASE 'Display'")
      //only select enabled ad groups
      //.withCondition("AdGroupStatus = ENABLED")
      //only select enabled keywords
      .withCondition("Status = ENABLED");
  var keywordIterator = keywordSelector.get();  
  while (keywordIterator.hasNext()) {
    var keyword = keywordIterator.next();
	//if not already labeled, then label it as such
	if (!hasLabel(keyword,'brand-keyword'))	{
      keyword.applyLabel('brand-keyword');
	}
  }
}

//////////// function to label keywords as calendar campaign related
function labelCalendarKeywords() {
  var keywordSelector = AdWordsApp.keywords()
      //only select enabled campaigns
      .withCondition("CampaignStatus = ENABLED")
      //only select calendar campaign keywords
      .withCondition("CampaignName CONTAINS_IGNORE_CASE 'Calendar'")
      //ignore display campaign keywords
      .withCondition("CampaignName DOES_NOT_CONTAIN_IGNORE_CASE 'Display'")
      //only select enabled ad groups
      //.withCondition("AdGroupStatus = ENABLED")
      //only select enabled keywords
      .withCondition("Status = ENABLED");
  var keywordIterator = keywordSelector.get();  
  while (keywordIterator.hasNext()) {
    var keyword = keywordIterator.next();
    //if not already labeled, then label it as such
	if (!hasLabel(keyword,'calendar-keyword'))	{
      keyword.applyLabel('calendar-keyword');
		}
  }
}

//////////// function to label keywords as search remarketing campaign related
function labelSearchRemarketingKeywords() {
  var keywordSelector = AdWordsApp.keywords()
      //only select enabled campaigns
      .withCondition("CampaignStatus = ENABLED")
      //only select search remarketing campaign keywords
      .withCondition("CampaignName CONTAINS_IGNORE_CASE 'Search Remarketing'")
      //ignore display campaign keywords
      .withCondition("CampaignName DOES_NOT_CONTAIN_IGNORE_CASE 'Display'")
      //only select enabled ad groups
      //.withCondition("AdGroupStatus = ENABLED")
      //only select enabled keywords
      .withCondition("Status = ENABLED");
  var keywordIterator = keywordSelector.get();  
  while (keywordIterator.hasNext()) {
    var keyword = keywordIterator.next();
    //if not already labeled, then label it as such
	if (!hasLabel(keyword,'search-remarketing-keyword'))	{
      keyword.applyLabel('search-remarketing-keyword');
		}
  }
}

//////////// function to label keywords as holiday search campaign related
function labelHolidayKeywords() {
  var keywordSelector = AdWordsApp.keywords()
      //only select enabled campaigns
      .withCondition("CampaignStatus = ENABLED")
      //only select 'businessholiday' campaign keywords
      .withCondition("CampaignName CONTAINS_IGNORE_CASE 'BusinessHoliday'")
      //ignore display campaign keywords
      .withCondition("CampaignName DOES_NOT_CONTAIN_IGNORE_CASE 'Display'")
      //only select enabled ad groups
      //.withCondition("AdGroupStatus = ENABLED")
      //only select enabled keywords
      .withCondition("Status = ENABLED");
  var keywordIterator = keywordSelector.get();  
  while (keywordIterator.hasNext()) {
    var keyword = keywordIterator.next();
    //if not already labeled, then label it as such
	if (!hasLabel(keyword,'holiday-keyword'))	{
      keyword.applyLabel('holiday-keyword');
		}
  }
}

//////////// function to label keywords as christmas campaign related
function labelChristmasKeywords() {
  var keywordSelector = AdWordsApp.keywords()
      //only select enabled campaigns
      .withCondition("CampaignStatus = ENABLED")
      //only select christmas campaign keywords
      .withCondition("CampaignName CONTAINS_IGNORE_CASE 'Christmas'")
      //ignore display campaign keywords
      .withCondition("CampaignName DOES_NOT_CONTAIN_IGNORE_CASE 'Display'")
      //only select enabled ad groups
      //.withCondition("AdGroupStatus = ENABLED")
      //only select enabled keywords
      .withCondition("Status = ENABLED");
  var keywordIterator = keywordSelector.get();  
  while (keywordIterator.hasNext()) {
    var keyword = keywordIterator.next();
    //if not already labeled, then label it as such
	if (!hasLabel(keyword,'christmas-keyword'))	{
      keyword.applyLabel('christmas-keyword');
		}
  }
}

  