//this script selects eye associates keywords that are uniquely labeled and
//bids them according to their specific bidding rules

// Spreadsheet template where we write the bid changes.
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1g4UKvlDqjQxjcqL_HkyAUgtNDVlvMvMsQvcYN0quBJ4/edit?usp=sharing';

// Once the keywords fall within TOLERANCE of TARGET_AVERAGE_POSITION,
// their bids will no longer be adjusted.
var TOLERANCE = 0.2;

// How much to adjust the bids.
var BID_ADJUSTMENT_COEFFICIENT = 1.03;

// Ad position we are trying to achieve for 'nonbrand-keyword-position2' labeled keywordrs
var TARGET_AVERAGE_POSITION_NON_BRAND_POSITION2 = 2;

// Ad position we are trying to achieve for 'broadkeywordposition4' labeled keywords
var TARGET_AVERAGE_POSITION_BROADKEYWORDPOSITION4 = 4;

//labels we want to select and manage
var labelsToManage = ['broadkeywordposition4', 'nonbrand-keyword-position2'];

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
	// Call function to select keywords by labels we want
	// this function stores all the keywords/ad group ids in an object that we then use
	//to call again to find their positions and manage
	for (i=1;i<labelsToManage.length;i++)	{
		selectKeywordsByLabel(labelsToManage[i]);
	}
    // Call function to select keywords with good position and bid lower
    lowerKeywordBids();
	//call function to write bid changes to sheet
	writeBidChanges();

	//select keywords with the broadkeywordposition4 label
	//we want to manage these keywords to position 4
	var keywordSelector = AdWordsApp.keywords()
	 .withCondition("LabelNames CONTAINS_ANY ['broadkeywordposition4']");
    
  	Logger.log('the number of elements in the selector is: ' + keywordSelector.get().totalNumEntities())
  
 	var keywordIterator = keywordSelector.get();
 	while (keywordIterator.hasNext()) {
   		var keyword = keywordIterator.next();
        Logger.log('the keyword is: ' + keyword.getText() + 
        ' the campaign is: ' + keyword.getCampaign().getName() + 
        ' the labels are: ');
         var keywordLabelsIterator = keyword.labels().get();
         while (keywordLabelsIterator.hasNext())  {
            var label = keywordLabelsIterator.next()
            var labelName = label.getName();
            Logger.log('the label is: '+ labelName);
          }
 	}
	
	//select keywords with the nonbrand-keyword-position2 label
	//we want to manage these keywords to position 2
	var keywordSelector = AdWordsApp.keywords()
	 .withCondition("LabelNames CONTAINS_ANY ['nonbrand-keyword-position2']");
    
  	Logger.log('the number of elements in the selector is: ' + keywordSelector.get().totalNumEntities())
  
 	var keywordIterator = keywordSelector.get();
 	while (keywordIterator.hasNext()) {
   		var keyword = keywordIterator.next();
        Logger.log('the keyword name is: ' + keyword.getText() + 
        'the campaign is: ' + keyword.getCampaign().getName() + 
        'the labels are: ');
         var keywordLabelsIterator = keyword.labels().get();
         while (keywordLabelsIterator.hasNext())  {
            var label = keywordLabelsIterator.next()
            var labelName = label.getName();
            Logger.log('the label is: '+ labelName);
          }
 	}

//end accountIterator
 }

//end main
}