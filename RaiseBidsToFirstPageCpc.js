//we want to give this new campaign a good chance of success
//so we are setting all the new keywords at first page cpc
//that way they will have a chance to show their performance

//bid adjustments for various max bids
//we do this because x% of $10 is a bigger absolute dollar value than x% of $0.05

//use low bid adjustment when FirstPageCPC is high (>$5.00
var BID_ADJUSTMENT_LOW_COEFFICIENT = 1.03
//use med bid adjustment when FirstPageCPC is >=$1.00 and <$5.00
var BID_ADJUSTMENT_MED_COEFFICIENT = 1.06
//use high bid adjustment when FirstPageCPC is <$1.00
var BID_ADJUSTMENT_HIGH_COEFFICIENT = 1.16


function main() {
  var keywordsIterator = AdWordsApp.keywords()
      .orderBy("FirstPageCpc DESC")
      .withCondition("CampaignStatus = ENABLED")
      .withCondition("AdGroupStatus = ENABLED")
      .withCondition("Status = ACTIVE")
      .get();
  
  
  //iterate through keyword selector to decide if there are keywords with max cpc < first page cpc
  while(keywordsIterator.hasNext()){
    var keyword = keywordsIterator.next();
	//store current value of keyword max cpc
    var currentMaxCpc = keyword.getMaxCpc();
	//store current value of FirstPageCpc
	var currentFirstPageCpc = keyword.getFirstPageCpc();
    // check to see if current max cpc is < first page Cpc and if FirstPageCpc < $1.00
    if (currentMaxCpc < currentFirstPageCpc && currentFirstPageCpc < 1.0){
      //change bid to first page cpc * BID_ADJUSTMENT_HIGH_COEFFICIENT
	  Logger.log('we have a low bid keyword where the bid is below first page cpc: ' + keyword.getCampaign()+','+ keyword.getAdGroup()+ 
	  ","+ keyword.getText());
      keyword.setMaxCpc(currentFirstPageCpc*BID_ADJUSTMENT_HIGH_COEFFICIENT);
      // log the changes to the console.
      Logger.log(' bid was changed' + 'from: ' + currentMaxCpc + ' to: ' + currentFirstPageCpc*BID_ADJUSTMENT_HIGH_COEFFICIENT);
    }
	// check to see if current max cpc is < first page Cpc and if FirstPageCpc is > $1.00 AND < $5.00
	else if (currentMaxCpc < currentFirstPageCpc && currentFirstPageCpc > 1.0 && currentFirstPageCpc < 5.0){
		 //change bid to first page cpc * BID_ADJUSTMENT_MED_COEFFICIENT
		 Logger.log('we have a mid bid keyword where the bid is below first page cpc: ' + keyword.getCampaign()+','+ keyword.getAdGroup()+ 
		 ","+ keyword.getText());
		  keyword.setMaxCpc(currentFirstPageCpc*BID_ADJUSTMENT_MED_COEFFICIENT);
		  // log the changes to the console.
		  Logger.log(' bid was changed' + 'from: ' + currentMaxCpc + ' to: ' + currentFirstPageCpc*BID_ADJUSTMENT_MED_COEFFICIENT);
	}
	else if (currentMaxCpc < currentFirstPageCpc && currentFirstPageCpc > 5.0){
		 //change bid to first page cpc * BID_ADJUSTMENT_LOW_COEFFICIENT
		 Logger.log('we have a high bid keyword where the bid is below first page cpc: ' + keyword.getCampaign()+','+ keyword.getAdGroup()+ 
		 ","+ keyword.getText());
		  keyword.setMaxCpc(currentFirstPageCpc*BID_ADJUSTMENT_LOW_COEFFICIENT);
		  // log the changes to the console.
		  Logger.log(' bid was changed' + 'from: ' + currentMaxCpc + ' to: ' + currentFirstPageCpc*BID_ADJUSTMENT_LOW_COEFFICIENT);
	}
	
  }

}