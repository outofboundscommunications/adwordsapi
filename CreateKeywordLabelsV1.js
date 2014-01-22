// Keywords with our brand name are "branded" keywords
// we also uniquely label nonbrand keywords

//what we want to do now is get this script to run on a scheduled basis and update new keywords with
//labels and skip already labeled keywords

//define arrays to contain words for each keyword category type

var BRAND = ['freedom', 'freedom furniture', 'shopfreedom'];

//if not brand then non brand
var NONBRAND = [ ] ;

function main() {
  //create the labels
  //createLabels();
  //label the branded keywords
    labelBrandedKeywords();
  //label the remaining, nonbrand keywords
    labelNonBrandedKeywords();

}

// labeling function, run once to create labels
function createLabels() {
  AdWordsApp.createLabel('brand-keyword', 'Keywords that are part of our brand', 'blue');
  AdWordsApp.createLabel('non-brand-keyword', 'Keywords that are not brand related', 'red');
}

/**
 * Returns true if this string is consider to be a part of our brand, false otherwise.
 */
function isBrand(s) {
  if (!s) {
    return false;
  }
  for (var i = 0; i < BRAND.length; i++) {
    if (s.toLowerCase().indexOf(BRAND[i].toLowerCase()) != -1) {
      return true;
    }
  }
  return false;
}

// Returns true if the keyword already has this label applied.

function hasLabel(keyword, label) {
  return keyword.labels().withCondition("Name = '" + label + "'").get().hasNext();
}
  
// function to label keywords as branded
function labelBrandedKeywords() {
  var keywordSelector = AdWordsApp.keywords()
      .withCondition("CampaignStatus = ENABLED")
      .withCondition("CampaignName CONTAINS_IGNORE_CASE 'Search'")
      .withCondition("AdGroupStatus = ENABLED")
  var keywordIterator = keywordSelector.get();  
  while (keywordIterator.hasNext()) {
    var keyword = keywordIterator.next();
    //check if keyword is brand by using isBrand() function
    if (isBrand(keyword.getText())) {
		//if not already labeled as brand keyword, then label it as such
	  if (!hasLabel(keyword,'brand-keyword'))	{
      	keyword.applyLabel('brand-keyword');
	  }
    }
  }
}

// function to label keywords as non-brand
function labelNonBrandedKeywords() {
  var keywordSelector = AdWordsApp.keywords()
      .withCondition("CampaignStatus = ENABLED")
      .withCondition("CampaignName CONTAINS_IGNORE_CASE 'Search'")
      .withCondition("AdGroupStatus = ENABLED")
  var keywordIterator = keywordSelector.get();  
  while (keywordIterator.hasNext()) {
    var keyword = keywordIterator.next();
    //check if keyword is !brand AND !military
    if(!isBrand(keyword.getText())) {
      //if not already labeled as non-brand keyword, then label it as such
	  	if (!hasLabel(keyword,'non-brand-keyword'))	{
	  		keyword.applyLabel('non-brand-keyword');
		}
    }
  }
}