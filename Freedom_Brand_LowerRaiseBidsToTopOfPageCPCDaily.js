//we don't want to overbid our brand keywords
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
		if (keyword.getMaxCpc()< keyword.getTopOfPageCpc()){
			  Logger.log(keyword.getCampaign()+','+ keyword.getAdGroup()+ ","+ keyword.getText()+',' + keyword.getMaxCpc()+ ',' + keyword.getFirstPageCpc());
			  var oldMaxCpc = keyword.getMaxCpc();
			  // and set their bids higher to 1.1* TopOfPageCpc
			  keyword.setMaxCpc(keyword.getTopOfPageCpc());
			  var newMaxCpc = keyword.getTopOfPageCpc()*1.1;
			  // log the changes to the console.
			  Logger.log(keyword.getCampaign()+','+ keyword.getAdGroup()+'the keyword: ' + keyword.getText() + 
			  ' bid was changed' + 'from: ' + oldMaxCpc + ' to: ' + newMaxCpc);
			}
		// find all keywords that have max cpc > 1.1 *TopOfPageCpc
		if (keyword.getMaxCpc()> keyword.getTopOfPageCpc()*1.1){
			  Logger.log(keyword.getCampaign()+','+ keyword.getAdGroup()+ ","+ keyword.getText()+',' + keyword.getMaxCpc()+ ',' + keyword.getFirstPageCpc());
			  var oldMaxCpc = keyword.getMaxCpc();
			  // and set their bids higher to 1.1* TopOfPageCpc
			  keyword.setMaxCpc(keyword.getTopOfPageCpc());
			  var newMaxCpc = keyword.getTopOfPageCpc()*1.1;
			  // log the changes to the console.
			  Logger.log(keyword.getCampaign()+','+ keyword.getAdGroup()+'the keyword: ' + keyword.getText() + 
			  ' bid was changed' + 'from: ' + oldMaxCpc + ' to: ' + newMaxCpc);
			}
     }
  }