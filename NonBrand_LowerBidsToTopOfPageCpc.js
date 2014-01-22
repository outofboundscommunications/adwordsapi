//here we lower bids to some fraction above the topof page cpc
//so that we dont spend too much money

//bid adjustments for various max bids
//we do this because x% of $10 is a bigger absolute dollar value than x% of $0.05

//use low bid adjustment when TopOfPageCPC is high (>$5.00
var BID_ADJUSTMENT_LOW_COEFFICIENT = 1.03
//use med bid adjustment when TopOfPageCPC is >=$1.00 and <$5.00
var BID_ADJUSTMENT_MED_COEFFICIENT = 1.06
//use high bid adjustment when TopOfPageCPC is <$1.00
var BID_ADJUSTMENT_HIGH_COEFFICIENT = 1.16
//use high bid adjustment when TopOfPageCPC is <$0.10
var BID_ADJUSTMENT_VERY_HIGH_COEFFICIENT = 1.5


function main() {
  var keywordsIterator = AdWordsApp.keywords()
      .orderBy("TopOfPageCpc DESC")
      .withCondition("CampaignStatus = ENABLED")
      .withCondition("AdGroupStatus = ENABLED")
      .withCondition("LabelNames CONTAINS_NONE ['brand-keyword']")
      .withCondition("Status = ACTIVE")
      .get();
  
  
  //iterate through keyword selector to decide if there are keywords with max cpc < top of page cpc
  while(keywordsIterator.hasNext()){
    var keyword = keywordsIterator.next();
	//store current value of keyword max cpc
    var currentMaxCpc = keyword.getMaxCpc();
	//store current value of TopofPageCpc
	var currentTopOfPageCpc = keyword.getTopOfPageCpc();
	
	// check to see if current max cpc is greater than the BID_ADJUSTMENT_VERY_HIGH_COEFFICIENT and if TopOfPageCpc < $0.10
    if (currentTopOfPageCpc > 5.0 && currentMaxCpc > BID_ADJUSTMENT_LOW_COEFFICIENT*currentTopOfPageCpc){
      //change bid to top of page cpc * BID_ADJUSTMENT_VERY_HIGH_COEFFICIENT
	  Logger.log('we have a high bid keyword where the bid is higher than the low coeff * top of page cpc: ' + 
	  keyword.getCampaign()+','+ keyword.getAdGroup()+ ","+ keyword.getText());
      keyword.setMaxCpc(currentTopOfPageCpc*BID_ADJUSTMENT_LOW_COEFFICIENT);
      // log the changes to the console.
      Logger.log(' bid was changed' + 'from: ' + currentMaxCpc + ' to: ' + currentTopOfPageCpc*BID_ADJUSTMENT_LOW_COEFFICIENT);
    }
	
    // check to see if current max cpc is greater than the BID_ADJUSTMENT_HIGH_COEFFICIENT and if TopOfPageCpc < $1.00
    else if (currentTopOfPageCpc > 1.0 && currentMaxCpc < 5.0 && currentMaxCpc > BID_ADJUSTMENT_MED_COEFFICIENT*currentTopOfPageCpc){
      //change bid to top of page cpc * BID_ADJUSTMENT_HIGH_COEFFICIENT
	  Logger.log('we have a mid bid keyword where the bid is higher than the medium coeff * top of page cpc: ' + 
	  keyword.getCampaign()+','+ keyword.getAdGroup()+ ","+ keyword.getText());
      keyword.setMaxCpc(currentTopOfPageCpc*BID_ADJUSTMENT_MED_COEFFICIENT);
      // log the changes to the console.
      Logger.log(' bid was changed' + 'from: ' + currentMaxCpc + ' to: ' + currentTopOfPageCpc*BID_ADJUSTMENT_MED_COEFFICIENT);
    }
	
	// check to see if current max cpc is < Top of Page Cpc and if TopOfPageCpc is > $1.00 AND < $5.00
	else if (currentTopOfPageCpc < 1 && currentMaxCpc > BID_ADJUSTMENT_HIGH_COEFFICIENT*currentTopOfPageCpc){
		 //change bid to top of page cpc * BID_ADJUSTMENT_MED_COEFFICIENT
		 Logger.log('we have a mid bid keyword where the bid is below top of page cpc: ' + keyword.getCampaign()+','+ keyword.getAdGroup()+ 
		 ","+ keyword.getText());
		  keyword.setMaxCpc(currentTopOfPageCpc*BID_ADJUSTMENT_MED_COEFFICIENT);
		  // log the changes to the console.
		  Logger.log(' bid was changed' + 'from: ' + currentMaxCpc + ' to: ' + currentTopOfPageCpc*BID_ADJUSTMENT_MED_COEFFICIENT);
	}
	
	else if (currentMaxCpc < currentTopOfPageCpc && currentTopOfPageCpc > 5.0){
		 //change bid to top of page cpc * BID_ADJUSTMENT_LOW_COEFFICIENT
		 Logger.log('we have a high bid keyword where the bid is below top of page cpc: ' + keyword.getCampaign()+','+ keyword.getAdGroup()+ 
		 ","+ keyword.getText());
		  keyword.setMaxCpc(currentTopOfPageCpc*BID_ADJUSTMENT_LOW_COEFFICIENT);
		  // log the changes to the console.
		  Logger.log(' bid was changed' + 'from: ' + currentMaxCpc + ' to: ' + currentTopOfPageCpc*BID_ADJUSTMENT_LOW_COEFFICIENT);
	}
	
  }

}