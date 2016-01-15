//finds keywords whose average position is outside tolerance and makes bid adjustments

//1. calendar keywords ('calendar-keyword') - identified as keywords within any campaign labeled as calendar - these are managed to position 2
//2. brand keywords ('brand-keyword') - identified as keywords within any campaign labeled as brand - these are managed to position 1 always
//3. search remarketing keywords - identified as keywords within any campaign labeled as search remarketing - these are managed to position 2
//4. holiday keywords ('holiday-keyword') - identified as keywords within any campaign labeled as holiday - these are managed to position 4
//5. christmas keywords - identified as keywords within any campaign labeled as christmas - these are managed to position 4

// Spreadsheet template where we write the bid changes.
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1LqD6WD25NHdqXNTOzDzA_p4aKDYT5xA14jG0r0iiQf4/edit?usp=sharing';

// Ad position we are trying to achieve for calendar keywords
var TARGET_POSITION_CALENDAR_KEYWORD = 2.0;
// Ad position we are trying to achieve for label: 'brand-keyword'.
var TARGET_POSITION_BRAND_KEYWORD = 1.2;
// Ad position we are trying to achieve for search remarketing keywords
var TARGET_POSITION_SEARCH_REMARKETING_KEYWORD = 2.0;
// Ad position we are trying to achieve for holiday keywords
var TARGET_POSITION_HOLIDAY_KEYWORD = 4.0;
// Ad position we are trying to achieve for christmas keywords
var TARGET_POSITION_CHRISTMAS_KEYWORD = 4.0;



// Once the keywords fall within TOLERANCE of TARGET_AVERAGE_POSITION,
// their bids will no longer be adjusted.
var TOLERANCE = 0.2;

// How much to adjust the bids.
var BID_ADJUSTMENT = 1.02;

//create constructor to hold bid/keyword object

function BidChange(CampaignName,AdGroupName,Text,MaxCpc,QualityScore,TopOfPageCpc,Impressions,Clicks,AveragePosition,AverageCpc,NewCpc,BidType)	{
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
	this.NewCpc = NewCpc;
	this.BidType = BidType;
	}

//define array of BidChanges objects
var bidChangesArray =[];

//start main function /////
function main() {
  // Get the posty cards account
  var accountSelector = MccApp.accounts()
    .withIds(['265-323-3899']);
  
  // Get current account I want
  var accountIterator = accountSelector.get();
  // Iterate thru the accounts (only one here)
  while (accountIterator.hasNext())  {
    var account = accountIterator.next();
    // Select the client account to operate on.
    MccApp.select(account);
    // Call function to select calendar keywords and manage their bids
    manageCalendarKeywords();
	// Call function to select brand keywords and manage bids
    manageBrandKeywords();
	// Call function to select search remarketing keywords and manage their bids
    manageSearchRemarketingKeywords();
	// manage holiday keywords
	manageHolidayKeywords();
	// manage christmas keywords
	manageChristmasKeywords();
	//call function to write bid changes to sheet
	writeBidChanges();
  }
}

//end main function /////

//manage brand keywords function
  function manageBrandKeywords()  {
    //create selector for keywords labeled with brand keyword label 
    var labelSelector = AdWordsApp.labels()
       .withCondition("Name = 'brand-keyword'");
    //create iterator for label
    var labelIterator = labelSelector.get();
    Logger.log('the number of labels is: ' + labelIterator.totalNumEntities());
    while (labelIterator.hasNext()) {
      var label = labelIterator.next();
      //create a keyword selector 
      var keywords = label.keywords();
      //create keyword iterator
      var keywordIterator = keywords.get();
      Logger.log('the number of keywords with this label is: ' + keywordIterator.totalNumEntities());
      while (keywordIterator.hasNext()) {
        var keyword = keywordIterator.next();
        var stats = keyword.getStatsFor("YESTERDAY");
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
        var myAvgCpc = stats.getAverageCpc();
		var myFirstPageCpc = keyword.getFirstPageCpc();
        //find keywords that are too low on page (position > desired + TOLERANCE)
        if (myImpr >4 && myPos > TARGET_POSITION_BRAND_KEYWORD + TOLERANCE)  {
          //set the bid type to raise
          var myBidType = 'raise';
          //define the new raised bid
          var newMaxCpc = myMaxCpc*BID_ADJUSTMENT;
		  //make sure our new bid is NOT below the first page cpc, if so, adjust it up
		  if (myFirstPageCpc > newMaxCpc) {
          	newMaxCpc = myFirstPageCpc*BID_ADJUSTMENT;
			Logger.log('adjusted new bid to be above first page cpc');
		  }
		  Logger.log('keyword is: ' + myText + ' campaign is: ' + myCmpgName + ' ad group is: ' + myAdGrpName + ' current position is: ' + myPos +
                   'current max cpc is: ' + myMaxCpc + ' keyword ranking is too high, we need to raise bid to: ' + newMaxCpc);
          //now go ahead and adjust the bid
          keyword.setMaxCpc(newMaxCpc);
          Logger.log("bid adjusted up to" + newMaxCpc);
          //store bid change in object
          var myBidChange = new BidChange(myCmpgName,myAdGrpName,myText,myMaxCpc,myQS,myTopPageCpc,myImpr,myClicks,myPos,myAvgCpc,newMaxCpc,myBidType);
          // & push to array
          bidChangesArray.push(myBidChange);
    	}
		//find keywords that are too high on page (position < desired - TOLERANCE)
		if (myImpr >4 && myPos < TARGET_POSITION_BRAND_KEYWORD-TOLERANCE)  {
          //set the bid type to raise
          var myBidType = 'lower';
          //define the new lowered bid
		  //we divide current bid by coefficient here)
          var newMaxCpc = myMaxCpc/BID_ADJUSTMENT;
		   //make sure our new bid is NOT below the first page cpc, if so, adjust it up
		  if (myFirstPageCpc > newMaxCpc) {
          	newMaxCpc = myFirstPageCpc*BID_ADJUSTMENT;
			Logger.log('adjusted new bid to be above first page cpc');
		  }
          Logger.log('keyword is: ' + myText + ' campaign is: ' + myCmpgName + ' ad group is: ' + myAdGrpName + ' current position is: ' + myPos +
                     'current max cpc is: ' + myMaxCpc + ' keyword ranking is too low, we need to lower bid to: ' + newMaxCpc);
          //now go ahead and adjust the bid
          keyword.setMaxCpc(newMaxCpc);
          Logger.log("bid adjusted down to" + newMaxCpc);
          //store bid change in object
          var myBidChange = new BidChange(myCmpgName,myAdGrpName,myText,myMaxCpc,myQS,myTopPageCpc,myImpr,myClicks,myPos,myAvgCpc,newMaxCpc,myBidType);
          // & push to array
          bidChangesArray.push(myBidChange);
    	}
		
  }
 }
 Logger.log('the total number of bid changes we have made is: ' + bidChangesArray.length);
}


//manage calendar keywords
  function manageCalendarKeywords()  {
    //create selector for keywords labeled with 'calendar-keyword' label
    var labelSelector = AdWordsApp.labels()
       .withCondition("Name = 'calendar-keyword'");
    //create iterator for label
    var labelIterator = labelSelector.get();
    Logger.log('the number of labels is: ' + labelIterator.totalNumEntities());
    while (labelIterator.hasNext()) {
      var label = labelIterator.next();
      //create a keyword selector 
      var keywords = label.keywords();
      //create keyword iterator
      var keywordIterator = keywords.get();
      Logger.log('the number of keywords with this label is: ' + keywordIterator.totalNumEntities());
      while (keywordIterator.hasNext()) {
        var keyword = keywordIterator.next();
        var stats = keyword.getStatsFor("YESTERDAY");
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
        var myAvgCpc = stats.getAverageCpc();
		var myFirstPageCpc = keyword.getFirstPageCpc();
        //find keywords that are too low on page (position > desired + TOLERANCE)
        if (myImpr >4 && myPos > TARGET_POSITION_CALENDAR_KEYWORD + TOLERANCE)  {
          //set the bid type to raise
          var myBidType = 'raise';

          //define the new raised bid
          var newMaxCpc = myMaxCpc*BID_ADJUSTMENT;
		  //make sure our new bid is NOT below the first page cpc, if so, adjust it up
		  if (myFirstPageCpc > newMaxCpc) {
          	newMaxCpc = myFirstPageCpc*BID_ADJUSTMENT;
			Logger.log('adjusted new bid to be above first page cpc');
		  }
          Logger.log('keyword is: ' + myText + ' campaign is: ' + myCmpgName + ' ad group is: ' + myAdGrpName + ' current position is: ' + myPos +
                     'current max cpc is: ' + myMaxCpc + ' keyword ranking is too high, we need to raise bid to: ' + newMaxCpc);
          //now go ahead and adjust the bid
		  //multiply current bid by coefficient
          keyword.setMaxCpc(newMaxCpc);
          Logger.log("bid adjusted up to" + newMaxCpc);
          //store bid change in object
          var myBidChange = new BidChange(myCmpgName,myAdGrpName,myText,myMaxCpc,myQS,myTopPageCpc,myImpr,myClicks,myPos,myAvgCpc,newMaxCpc,myBidType);
          // & push to array
          bidChangesArray.push(myBidChange);
    	}
		//find keywords that are too high on page (position < desired - TOLERANCE)
		if (myImpr >4 && myPos < TARGET_POSITION_CALENDAR_KEYWORD - TOLERANCE)  {
          //set the bid type to raise
          var myBidType = 'lower';
          //define the new lowered bid
		  //we divide current bid by coefficient here)
          var newMaxCpc = myMaxCpc/BID_ADJUSTMENT;
		  //make sure our new bid is NOT below the first page cpc, if so, adjust it up
		  if (myFirstPageCpc > newMaxCpc) {
          	newMaxCpc = myFirstPageCpc*BID_ADJUSTMENT;
			Logger.log('adjusted new bid to be above first page cpc');
		  }
          Logger.log('keyword is: ' + myText + ' campaign is: ' + myCmpgName + ' ad group is: ' + myAdGrpName + ' current position is: ' + myPos +
                     'current max cpc is: ' + myMaxCpc + ' keyword ranking is too low, we need to lower bid to: ' + newMaxCpc);
          //now go ahead and adjust the bid
          keyword.setMaxCpc(newMaxCpc);
          Logger.log("bid adjusted down to" + newMaxCpc);
          //store bid change in object
          var myBidChange = new BidChange(myCmpgName,myAdGrpName,myText,myMaxCpc,myQS,myTopPageCpc,myImpr,myClicks,myPos,myAvgCpc,newMaxCpc,myBidType);
          // & push to array
          bidChangesArray.push(myBidChange);
    	}
		
  }
 }
 Logger.log('the total number of bid changes we have made is: ' + bidChangesArray.length);
}


//manage search remarketing keywords
  function  manageSearchRemarketingKeywords()  {
    //create selector for keywords labeled with 'search-remarketing' label
    var labelSelector = AdWordsApp.labels()
       .withCondition("Name = 'search-remarketing-keyword'");
    //create iterator for label
    var labelIterator = labelSelector.get();
    Logger.log('the number of labels is: ' + labelIterator.totalNumEntities());
    while (labelIterator.hasNext()) {
      var label = labelIterator.next();
      //create a keyword selector 
      var keywords = label.keywords();
      //create keyword iterator
      var keywordIterator = keywords.get();
      Logger.log('the number of keywords with this label is: ' + keywordIterator.totalNumEntities());
      while (keywordIterator.hasNext()) {
        var keyword = keywordIterator.next();
        var stats = keyword.getStatsFor("YESTERDAY");
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
        var myAvgCpc = stats.getAverageCpc();
		var myFirstPageCpc = keyword.getFirstPageCpc();
        //find keywords that are too low on page (position > desired + TOLERANCE)
        if (myImpr >4 && myPos > TARGET_POSITION_SEARCH_REMARKETING_KEYWORD + TOLERANCE)  {
          //set the bid type to raise
          var myBidType = 'raise';
          //define the new raised bid
          var newMaxCpc = myMaxCpc*BID_ADJUSTMENT;
		  //make sure our new bid is NOT below the first page cpc, if so, adjust it up
		  if (myFirstPageCpc > newMaxCpc) {
          	newMaxCpc = myFirstPageCpc*BID_ADJUSTMENT;
			Logger.log('adjusted new bid to be above first page cpc');
		  }
          Logger.log('keyword is: ' + myText + ' campaign is: ' + myCmpgName + ' ad group is: ' + myAdGrpName + ' current position is: ' + myPos +
                     'current max cpc is: ' + myMaxCpc + ' keyword ranking is too high, we need to raise bid to: ' + newMaxCpc);
          //now go ahead and adjust the bid
		  //multiply current bid by coefficient
          keyword.setMaxCpc(newMaxCpc);
          Logger.log("bid adjusted up to" + newMaxCpc);
          //store bid change in object
          var myBidChange = new BidChange(myCmpgName,myAdGrpName,myText,myMaxCpc,myQS,myTopPageCpc,myImpr,myClicks,myPos,myAvgCpc,newMaxCpc,myBidType);
          // & push to array
          bidChangesArray.push(myBidChange);
    	}
		//find keywords that are too high on page (position < desired - TOLERANCE)
		if (myImpr >4 && myPos < TARGET_POSITION_SEARCH_REMARKETING_KEYWORD - TOLERANCE)  {
          //set the bid type to raise
          var myBidType = 'lower';
          //define the new lowered bid
		  //we divide current bid by coefficient here)
          var newMaxCpc = myMaxCpc/BID_ADJUSTMENT;
		   //make sure our new bid is NOT below the first page cpc, if so, adjust it up
		  if (myFirstPageCpc > newMaxCpc) {
          	newMaxCpc = myFirstPageCpc*BID_ADJUSTMENT;
			Logger.log('adjusted new bid to be above first page cpc');
		  }
          Logger.log('keyword is: ' + myText + ' campaign is: ' + myCmpgName + ' ad group is: ' + myAdGrpName + ' current position is: ' + myPos +
                     'current max cpc is: ' + myMaxCpc + ' keyword ranking is too low, we need to lower bid to: ' + newMaxCpc);
          //now go ahead and adjust the bid
          keyword.setMaxCpc(newMaxCpc);
          Logger.log("bid adjusted down to" + newMaxCpc);
          //store bid change in object
          var myBidChange = new BidChange(myCmpgName,myAdGrpName,myText,myMaxCpc,myQS,myTopPageCpc,myImpr,myClicks,myPos,myAvgCpc,newMaxCpc,myBidType);
          // & push to array
          bidChangesArray.push(myBidChange);
    	}
		
  }
 }
 Logger.log('the total number of bid changes we have made is: ' + bidChangesArray.length);
}
//manage holiday keywords
  function  manageHolidayKeywords()  {
    //create selector for keywords labeled with 'holiday-keyword' label
    var labelSelector = AdWordsApp.labels()
       .withCondition("Name = 'holiday-keyword'");
    //create iterator for label
    var labelIterator = labelSelector.get();
    Logger.log('the number of labels is: ' + labelIterator.totalNumEntities());
    while (labelIterator.hasNext()) {
      var label = labelIterator.next();
      //create a keyword selector 
      var keywords = label.keywords();
      //create keyword iterator
      var keywordIterator = keywords.get();
      Logger.log('the number of keywords with this label is: ' + keywordIterator.totalNumEntities());
      while (keywordIterator.hasNext()) {
        var keyword = keywordIterator.next();
        var stats = keyword.getStatsFor("YESTERDAY");
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
        var myAvgCpc = stats.getAverageCpc();
		var myFirstPageCpc = keyword.getFirstPageCpc();
        //find keywords that are too low on page (position > desired + TOLERANCE)
        if (myImpr >4 && myPos > TARGET_POSITION_HOLIDAY_KEYWORD + TOLERANCE)  {
          //set the bid type to raise
          var myBidType = 'raise';
          //define the new raised bid
          var newMaxCpc = myMaxCpc*BID_ADJUSTMENT;
		  //make sure our new bid is NOT below the first page cpc, if so, adjust it up
		  if (myFirstPageCpc > newMaxCpc) {
          	newMaxCpc = myFirstPageCpc*BID_ADJUSTMENT;
			Logger.log('adjusted new bid to be above first page cpc');
		  }
          Logger.log('keyword is: ' + myText + ' campaign is: ' + myCmpgName + ' ad group is: ' + myAdGrpName + ' current position is: ' + myPos +
                     'current max cpc is: ' + myMaxCpc + ' keyword ranking is too high, we need to raise bid to: ' + newMaxCpc);
          //now go ahead and adjust the bid
		  //multiply current bid by coefficient
          keyword.setMaxCpc(newMaxCpc);
          Logger.log("bid adjusted up to" + newMaxCpc);
          //store bid change in object
          var myBidChange = new BidChange(myCmpgName,myAdGrpName,myText,myMaxCpc,myQS,myTopPageCpc,myImpr,myClicks,myPos,myAvgCpc,newMaxCpc,myBidType);
          // & push to array
          bidChangesArray.push(myBidChange);
    	}
		//find keywords that are too high on page (position < desired - TOLERANCE)
		if (myImpr >4 && myPos < TARGET_POSITION_HOLIDAY_KEYWORD - TOLERANCE)  {
          //set the bid type to raise
          var myBidType = 'lower';
          //define the new lowered bid
		  //we divide current bid by coefficient here)
          var newMaxCpc = myMaxCpc/BID_ADJUSTMENT;
		   //make sure our new bid is NOT below the first page cpc, if so, adjust it up
		  if (myFirstPageCpc > newMaxCpc) {
          	newMaxCpc = myFirstPageCpc*BID_ADJUSTMENT;
			Logger.log('adjusted new bid to be above first page cpc');
		  }
          Logger.log('keyword is: ' + myText + ' campaign is: ' + myCmpgName + ' ad group is: ' + myAdGrpName + ' current position is: ' + myPos +
                     'current max cpc is: ' + myMaxCpc + ' keyword ranking is too low, we need to lower bid to: ' + newMaxCpc);
          //now go ahead and adjust the bid
          keyword.setMaxCpc(newMaxCpc);
          Logger.log("bid adjusted down to" + newMaxCpc);
          //store bid change in object
          var myBidChange = new BidChange(myCmpgName,myAdGrpName,myText,myMaxCpc,myQS,myTopPageCpc,myImpr,myClicks,myPos,myAvgCpc,newMaxCpc,myBidType);
          // & push to array
          bidChangesArray.push(myBidChange);
    	}
		
  }
 }
 Logger.log('the total number of bid changes we have made is: ' + bidChangesArray.length);
}

//manage christmas keywords
  function  manageChristmasKeywords()  {
    //create selector for keywords labeled with 'holiday-keyword' label
    var labelSelector = AdWordsApp.labels()
       .withCondition("Name = 'christmas-keyword'");
    //create iterator for label
    var labelIterator = labelSelector.get();
    Logger.log('the number of labels is: ' + labelIterator.totalNumEntities());
    while (labelIterator.hasNext()) {
      var label = labelIterator.next();
      //create a keyword selector 
      var keywords = label.keywords();
      //create keyword iterator
      var keywordIterator = keywords.get();
      Logger.log('the number of keywords with this label is: ' + keywordIterator.totalNumEntities());
      while (keywordIterator.hasNext()) {
        var keyword = keywordIterator.next();
        var stats = keyword.getStatsFor("YESTERDAY");
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
        var myAvgCpc = stats.getAverageCpc();
		var myFirstPageCpc = keyword.getFirstPageCpc();
        //find keywords that are too low on page (position > desired + TOLERANCE)
        if (myImpr >4 && myPos > TARGET_POSITION_CHRISTMAS_KEYWORD + TOLERANCE)  {
          //set the bid type to raise
          var myBidType = 'raise';
          //define the new raised bid
          var newMaxCpc = myMaxCpc*BID_ADJUSTMENT;
		  //make sure our new bid is NOT below the first page cpc, if so, adjust it up
		  if (myFirstPageCpc > newMaxCpc) {
          	newMaxCpc = myFirstPageCpc*BID_ADJUSTMENT;
			Logger.log('adjusted new bid to be above first page cpc');
		  }
          Logger.log('keyword is: ' + myText + ' campaign is: ' + myCmpgName + ' ad group is: ' + myAdGrpName + ' current position is: ' + myPos +
                     'current max cpc is: ' + myMaxCpc + ' keyword ranking is too high, we need to raise bid to: ' + newMaxCpc);
          //now go ahead and adjust the bid
		  //multiply current bid by coefficient
          keyword.setMaxCpc(newMaxCpc);
          Logger.log("bid adjusted up to" + newMaxCpc);
          //store bid change in object
          var myBidChange = new BidChange(myCmpgName,myAdGrpName,myText,myMaxCpc,myQS,myTopPageCpc,myImpr,myClicks,myPos,myAvgCpc,newMaxCpc,myBidType);
          // & push to array
          bidChangesArray.push(myBidChange);
    	}
		//find keywords that are too high on page (position < desired - TOLERANCE)
		if (myImpr >4 && myPos < TARGET_POSITION_CHRISTMAS_KEYWORD - TOLERANCE)  {
          //set the bid type to raise
          var myBidType = 'lower';
          //define the new lowered bid
		  //we divide current bid by coefficient here)
          var newMaxCpc = myMaxCpc/BID_ADJUSTMENT;
		   //make sure our new bid is NOT below the first page cpc, if so, adjust it up
		  if (myFirstPageCpc > newMaxCpc) {
          	newMaxCpc = myFirstPageCpc*BID_ADJUSTMENT;
			Logger.log('adjusted new bid to be above first page cpc');
		  }
          Logger.log('keyword is: ' + myText + ' campaign is: ' + myCmpgName + ' ad group is: ' + myAdGrpName + ' current position is: ' + myPos +
                     'current max cpc is: ' + myMaxCpc + ' keyword ranking is too low, we need to lower bid to: ' + newMaxCpc);
          //now go ahead and adjust the bid
          keyword.setMaxCpc(newMaxCpc);
          Logger.log("bid adjusted down to" + newMaxCpc);
          //store bid change in object
          var myBidChange = new BidChange(myCmpgName,myAdGrpName,myText,myMaxCpc,myQS,myTopPageCpc,myImpr,myClicks,myPos,myAvgCpc,newMaxCpc,myBidType);
          // & push to array
          bidChangesArray.push(myBidChange);
    	}
		
  }
 }
 Logger.log('the total number of bid changes we have made is: ' + bidChangesArray.length);
}
//function to write changes to google sheet
function writeBidChanges()	{
  //open spreadsheet by url
  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  // fetch the sheet for DC_PPC Bidding
  var sheet = spreadsheet.getSheetByName('KeywordsBids');
  
   //create a variable for today to time stamp when we ran report
   var now = new Date();
   var myDate = Utilities.formatDate(now, "CST", "yyyyMMdd");
	  
  //write to sheet (append)
  for (var i = 0; i < bidChangesArray.length; i++) {
    sheet.appendRow(
	[myDate,
	bidChangesArray[i].CampaignName, 
	bidChangesArray[i].AdGroupName,
	bidChangesArray[i].Text,
	bidChangesArray[i].MaxCpc,
	bidChangesArray[i].QualityScore,
	bidChangesArray[i].TopOfPageCpc,
	bidChangesArray[i].Impressions,
	bidChangesArray[i].Clicks,
	bidChangesArray[i].AveragePosition,
	bidChangesArray[i].AverageCpc,
	bidChangesArray[i].NewCpc,
	bidChangesArray[i].BidType]
	);
  }
}