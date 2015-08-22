

/* Calculate entry price given desired percentage, or entry percentage given desired price */ 

function calcAll(){

    var original_symbol = $.trim($("#quote_input").val()); 
    original_symbol = original_symbol.replace(/\.p\./gi, ".P"); 
    original_symbol = original_symbol.toUpperCase(); 

    var newCalculatedPrice = $("#yestCloseText").val() - ($("#entryPercentage").val()*($("#yestCloseText").val()/100))
    $("#calculatedPrice").html(newCalculatedPrice.toFixed(5)); 

    var newCalculatedPercentage=(($("#yestCloseText").val()-$("#entryPrice").val())/$("#yestCloseText").val())*100
    $("#calculatedPercentage").html(newCalculatedPercentage.toFixed(2)); 

    var finalNumShares = $("#amountSpending").val()/$("#entryPrice").val(); 

    var finalPriceDisplay =  $("#entryPrice").val()

    if (finalPriceDisplay < 1.00)
    {
        finalPriceDisplay = "0" + finalPriceDisplay.toString(); 
    }   

    var roundSharesOptionValue =  $("input[name=roundShares]:checked").val(); 

    var finalNumSharesRounded = (Math.round(finalNumShares/roundSharesOptionValue)*roundSharesOptionValue); 
    if (finalNumSharesRounded > finalNumShares)
    {
      finalNumSharesRounded -= roundSharesOptionValue; 
    }

    var finalEntryPrice = Number($("#entryPrice").val());
    var totalValue = finalEntryPrice*finalNumSharesRounded; 
    var totalValueString = totalValue.toString(); 
    var positionOfDecimal = totalValueString.indexOf(".");
    if (positionOfDecimal > -1)
    {
            totalValueString = totalValueString.substr(0, positionOfDecimal); 
    }
    totalValueString = totalValueString.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    var finalNumSharesWithCommas = finalNumShares.toFixed(2); 
    finalNumSharesWithCommas = finalNumSharesWithCommas.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    var finalSharesRoundedWithCommas = finalNumSharesRounded;
    finalSharesRoundedWithCommas = finalSharesRoundedWithCommas.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");    

    $("#numShares").html(finalNumSharesWithCommas); 

    $("#orderStub").val(original_symbol + " BUY " + finalSharesRoundedWithCommas + " $" + finalPriceDisplay + " (" + newCalculatedPercentage.toFixed(2) + "%) -- $" + totalValueString); 


} // end of calcAll() function 


// if the user manually types in a new number of shares, recalculate only the order stub 

function reCalcOrderStub()
{
    var orderStub = $("#orderStub").val();
    var orderStubSplit = orderStub.split(" ");
    var numShares = orderStubSplit[2];
    var finalPriceDisplay =  $("#entryPrice").val(); 

    var original_symbol = $.trim($("#quote_input").val()); 
    original_symbol = original_symbol.replace(/\.p\./gi, ".P"); 
    original_symbol = original_symbol.toUpperCase(); 

    numSharesWithoutCommas = numShares.replace(/,/g, "")

    var totalValue = (numSharesWithoutCommas*finalPriceDisplay);

    var totalValueString = totalValue.toString(); 
    var positionOfDecimal = totalValueString.indexOf(".");
    if (positionOfDecimal > -1)
    {
            totalValueString = totalValueString.substr(0, positionOfDecimal); 
    }
    totalValueString = totalValueString.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    var newCalculatedPercentage=(($("#yestCloseText").val()-$("#entryPrice").val())/$("#yestCloseText").val())*100
    $("#calculatedPercentage").html(newCalculatedPercentage.toFixed(2)); 

    if (finalPriceDisplay < 1.00)
    {
        finalPriceDisplay = "0" + finalPriceDisplay.toString(); 
    }   

    var ctl = document.getElementById("orderStub");
    var startPos = ctl.selectionStart;

    $("#orderStub").val(original_symbol + " BUY " + numShares + " $" + finalPriceDisplay + " (" + newCalculatedPercentage.toFixed(2) + "%) -- $" + totalValueString); 

    ctl.setSelectionRange(startPos, startPos); 

} // end of reCalcOrderStub 

var blink = function(){
    $('#bigcharts_chart_container').fadeOut(500).fadeIn(500);
};


// init function

$(function() {

  setInterval(blink, 3000);

  // set the focus to the symbol input field
  $("#quote_input").focus();

  // once the submit button is clicked

   $("#submit_button").click(function(){

   	var original_symbol = $.trim($("#quote_input").val()); 
   	var symbol;
   	var positionOfPeriod; 
    var yahooCompanyName = ""; 
    var stockOrFund = ""; 
    var yesterdaysClose; 
    var google_keyword_string= "";

    // first, clear all the DIVS to give the impression that it is refreshing 

   	positionOfPeriod = original_symbol.indexOf(".");
   	stringLength = original_symbol.length; 

    // set the volume checked variable to 0

    $("#volumeChecked").html("0");

   	// take out the 5th "W/R/Z" for symbols like CBSTZ. 

    if ( $("#strip_last_character_checkbox").prop('checked') && (positionOfPeriod > -1) )
    {
      // if any stocks have a ".PD" or a ".WS", etc... 

    symbol = original_symbol.substr(0, positionOfPeriod); 
    }
   	else if ( $("#strip_last_character_checkbox").prop('checked') && (original_symbol.length == 5) )
   	{
   		symbol = original_symbol.slice(0,-1); 
   	}
   	else
   	{
		symbol = original_symbol;    		
   	}

    original_symbol = original_symbol.replace(/\.p\./gi, ".P"); 

    $("#yestCloseText").val("");
    $("#entryPrice").val("-----"); 
    $("#entryPercentage").val("-----");
    $("#amountSpending").val("-----");
    $("#orderStub").val("-----------------------"); 

    $("#yestCloseText").focus();

    $("div#bigcharts_chart_container").html("<img style='max-width:100%; max-height:100%;' src='http://bigcharts.marketwatch.com/kaavio.Webhost/charts/big.chart?nosettings=1&symb=" + original_symbol + "&uf=0&type=2&size=2&freq=1&entitlementtoken=0c33378313484ba9b46b8e24ded87dd6&time=4&rand=" + Math.random() + "&compidx=&ma=0&maval=9&lf=1&lf2=0&lf3=0&height=335&width=579&mocktick=1'>");
     
    $("div#bigcharts_chart_container").css("background-color", "#BBDDFF");
    $("div#right_bottom_container").css("background-color", "#BBDDFF");                   
    $.ajax({
          url: "proxy.php",
          data: {symbol: original_symbol,
              stockOrFund: stockOrFund, 
              which_website: "bigcharts", 
              host_name: "bigcharts.marketwatch.com"},
          async: false, 
          dataType: 'html',
          success:  function (data) {
            console.log(data);
           $("div#bigcharts_yest_close").html(data + "<img style='max-width:100%; max-height:100%;' src='http://bigcharts.marketwatch.com/kaavio.Webhost/charts/big.chart?nosettings=1&symb=" + original_symbol + "&uf=0&type=2&size=2&freq=7&entitlementtoken=0c33378313484ba9b46b8e24ded87dd6&time=3&rand=" + Math.random() + "&compidx=&ma=0&maval=9&lf=1&lf2=0&lf3=0&height=335&width=579&mocktick=1'>"); 
          }
      });  // end of AJAX call to bigcharts   
    $("div#bigcharts_chart_container").css("background-color", "#F3F3FF");                         
    $("div#right_bottom_container").css("background-color", "#F3F3FF");                   

    // AJAX call to yahoo finance 

    $("div#right_top_container").css("background-color", "#BBDDFF");                
    $.ajax({
	  url: "proxy.php",
	  data: {symbol: symbol,
	    	   which_website: "yahoo", 
	    	   host_name: "finance.yahoo.com"}, 
      async: false, 
	    dataType: 'html',
	    success:  function (data) {
	    	console.log(data);

        yahooCompanyName = " " + data.match(/<h1(.*?)h1>/g) + " "; 

        google_keyword_string = yahooCompanyName;
        google_keyword_string = $.trim(google_keyword_string); 
        google_keyword_string = google_keyword_string.replace(/<h1>/ig, "");
        google_keyword_string = google_keyword_string.replace(/<\/h1>/ig, "");
        google_keyword_string = google_keyword_string.replace(/\(/ig, "");
        google_keyword_string = google_keyword_string.replace(/\)/ig, "");
        google_keyword_string = google_keyword_string.replace(/\,/ig, "");
        google_keyword_string = google_keyword_string.replace(/ /ig, "+");
        google_keyword_string = google_keyword_string.replace(/&/ig, "");
        google_keyword_string = google_keyword_string.replace(/amp;/ig, "");        

// for demo purposes, we won't launch the extra window with google news

//        window.open("https://www.google.com/search?hl=en&gl=us&tbm=nws&authuser=1&q=" +  google_keyword_string);

	    	$("div#right_top_container").html(data); 

        yesterdaysClose = " " + data.match(/<h4(.*?)h4>/g) + " "; 
        yesterdaysClose = yesterdaysClose.replace(/ <h4>/ig, "");
        yesterdaysClose = yesterdaysClose.replace(/<\/h4> /ig, "");         

        etfStringLocation =  yahooCompanyName.search(/ etf /i);

        // if it is an ETF then we need to tell the proxy server that, so when it 
        // searches for marketwatch information it can insert "fund" instead of "stock"
        // in the URl. 

        if (etfStringLocation > -1)
        {           
            stockOrFund = "fund"; 
        }
        else
        {
            stockOrFund = "stock";
        } 
    	} // yahoo success function 
	});  // yahoo ajax   
  $("div#right_top_container").css("background-color", "#F3F3FF");                   

  var eTradeIFrame = '<br><iframe id="etrade_iframe" src="https://www.etrade.wallst.com/v1/stocks/news/search_results.asp?symbol=' + symbol + '&rsO=new#lastTradeTime" width="575px" height="340px"></iframe>';
//  var googleIFrame = '<br><iframe src="https://www.google.com/search?hl=en&gl=us&tbm=nws&authuser=0&q=' + google_keyword_string + '&oq=' + google_keyword_string + '" width="575px" height="400px"></iframe>'; 

  // AJAX call to marketwatch 

  $("div#left_bottom_container").css("background-color", "#BBDDFF");                     
 	$.ajax({
	    url: "proxy.php",
	    data: {symbol: symbol,
           stockOrFund: stockOrFund, 
	    	   which_website: "marketwatch", 
	    	   host_name: "www.marketwatch.com"},
       async: false, 
	    dataType: 'html',
	    success:  function (data) {
	    	console.log(data);
	    	$("div#left_bottom_container").html(data + eTradeIFrame); 
    	}
	});  // end of AJAX call to marketwatch     
  $("div#left_bottom_container").css("background-color", "#F3F3FF");   
  var myIframe = document.getElementById('iframe');
      myIframe.contentWindow.scrollTo(75, 100); 

}); // End of click function 

$('#quote_input').keypress(function(e){
      if(e.keyCode==13)
      $('#submit_button').click();
	});

$(document.body).on('keyup', "#entryPercentage", function(){
      calcAll(); 
});  // end of entryPercentage change function

$(document.body).on('keyup', "#entryPrice", function(){
      calcAll(); 
});  // end of entryPrice change function

$(document.body).on('keyup', "#yestCloseText", function(){
      calcAll(); 
});  // when yesterday close changes 

$(document.body).on('keyup', "#amountSpending", function(){
      var volumeChecked = $("#volumeChecked").html();
      if (volumeChecked == "0")
      {
        alert("Check the current TMX Powerstream volume against the 3 month volume");
        $("#volumeChecked").html("1");
      }

      calcAll(); 
});  // when you change the amount you are putting down changes 

$(document.body).on('change', "input[type=radio][name=roundShares]", function(){
       calcAll(); 
});  // when one of the round-to-nearest radio buttons changes

$(document.body).on('keyup', "#orderStub", function(){
       reCalcOrderStub(); 
});  // when one of the round-to-nearest radio buttons changes

    $("#yestCloseText").val("");
    $("#entryPrice").val("-----"); 
    $("#entryPercentage").val("-----");
    $("#amountSpending").val("-----");
    $("#orderStub").val("-----------------------");    

});  // End of the initial automatically called function