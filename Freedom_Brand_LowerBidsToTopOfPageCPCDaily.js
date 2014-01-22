//we don't want to underbid our  brand keywords
//so we adjust the bids daily to be 110% of the top of page cpc

function main() {
  
  var keywordsIterator = AdWordsApp.keywords()
      .orderBy("TopOfPageCpc DESC")
      .withCondition("CampaignStatus = ENABLED")
      .withCondition("AdGroupStatus = ENABLED")
	  .withCondition("LabelNames CONTAINS_ANY ['brand-keyword']")
      .get();
  while(keywordsIterator.hasNext()){
    var keyword = keywordsIterator.next();
      // find all keywords that have max cpc < TopOfPageCpc
       if (keyword.getMaxCpc()> keyword.getTopOfPageCpc()){
			  var oldMaxCpc = keyword.getMaxCpc();
			  // and set their bids higher to 1.1* TopOfPageCpc
              var newMaxCpc = (keyword.getTopOfPageCpc())*1.1;
			  keyword.setMaxCpc(newMaxCpc);
			  // log the changes to the console.
			  Logger.log(keyword.getCampaign()+','+ keyword.getAdGroup()+'the keyword: ' + keyword.getText() + 
			  ' bid was changed' + 'from: ' + oldMaxCpc + ' to: ' + newMaxCpc);
			}
     }
  }