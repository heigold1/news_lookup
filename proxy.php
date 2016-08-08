<?php 

require_once("simple_html_dom.php"); 
error_reporting(0);

// header('Content-type: text/html');
$symbol=$_GET['symbol'];
$host_name=$_GET['host_name'];
$which_website=$_GET['which_website'];
$stockOrFund=$_GET['stockOrFund']; 
$google_keyword_string = $_GET['google_keyword_string'];

fopen("cookies.txt", "w");

/*
 * Function: grabHTML - Get the contents of an html file, return it as an html string
 *
 * @param function_host_name - The host name (i.e. www.marketwatch.com)
 * @param url - The full website (i.e. for Microsoft http://www.marketwatch.com/q?s=MSFT&ql=1)
 *
 * returns $marketWatchfinalReturn - The parsed html code for the page
 */

function grabHTML($function_host_name, $url)
{

  $ch = curl_init();
  $header=array('GET /1575051 HTTP/1.1',
    "Host: $function_host_name",
    'Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language:en-US,en;q=0.8',
    'Cache-Control:max-age=0',
    'Connection:keep-alive',
    'User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36',
  );

  curl_setopt($ch,CURLOPT_URL,$url);
  curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
  curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,0);
  curl_setopt( $ch, CURLOPT_COOKIESESSION, true );
  curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
  curl_setopt($ch,CURLOPT_COOKIEFILE,'cookies.txt');
  curl_setopt($ch,CURLOPT_COOKIEJAR,'cookies.txt');
  curl_setopt($ch,CURLOPT_HTTPHEADER,$header);

  $returnHTML = curl_exec($ch); 
  return $returnHTML; 
  curl_close($ch);

} // end of function grabHTML

$ret = "";
$finalReturn = "";

if ($which_website == "marketwatch")
{
      $url="http://$host_name/investing/$stockOrFund/$symbol/news";
      $result = grabHTML($host_name, $url); 
      $html = str_get_html($result);

      if (($pos = strpos($html, "<html><head><title>Object moved") > -1) && 
          ($stockOrFund == "stock"))
          {
              $url="http://$host_name/investing/fund/$symbol/news";
              $result = grabHTML($host_name, $url); 
          }
      else if (($pos = strpos($html, "<html><head><title>Object moved") > -1) && 
          ($stockOrFund == "fund"))
          {
              $url="http://$host_name/investing/stock/$symbol/news";
              $result = grabHTML($host_name, $url); 
          }

      $result = str_replace ('href="/', 'href="http://www.marketwatch.com/', $result);  
      $result = str_replace ('heigoldinvestments.com', 'marketwatch.com', $result); 
      $result = str_replace ('localhost', 'www.marketwatch.com', $result); 

      $html = str_get_html($result);

      $full_company_name = $html->find('#instrumentname'); 
      $ret = $html->find('#maincontent'); 

      $returnHTML = $ret[0]; 

      // Keep track of news keywords, highlight the appropriate ones 

      $returnHTML = str_replace('<span>', '<span style="font-weight: bold;">', $returnHTML); 
      $returnHTML = preg_replace('/ delisted|delisted /i', '<span style="font-size: 12px; background-color:red; color:black"><b> &nbsp;DELISTED</b>&nbsp;</span>', $returnHTML);
      $returnHTML = preg_replace('/ delisting|delisting /i', '<span style="font-size: 12px; background-color:red; color:black"><b> &nbsp;DELISTING</b>&nbsp;</span>', $returnHTML);
      $returnHTML = preg_replace('/ chapter 11|chapter 11 /i', '<span style="font-size: 12px; background-color:red; color:black"><b> &nbsp;CHAPTER 11</b>&nbsp;</span>', $returnHTML);
      $returnHTML = preg_replace('/ reverse split|reverse split /i', '<span style="font-size: 12px; background-color:red; color:black"><b> &nbsp;REVERSE SPLIT</b>&nbsp;</span>', $returnHTML);
      $returnHTML = preg_replace('/ reverse stock split|reverse stock split /i', '<span style="font-size: 12px; background-color:red; color:black"><b> &nbsp;REVERSE STOCK SPLIT</b>&nbsp;</span>', $returnHTML);
      $returnHTML = preg_replace('/ seeking alpha|seeking alpha /i', '<font size="3" style="font-size: 12px; background-color:#CCFF99; color: black; display: inline-block;">&nbsp;<b>Seeking Alpha</b>&nbsp;</font>', $returnHTML);      
      $returnHTML = preg_replace('/ downgrade|downgrade /i', '<span style="font-size: 12px; background-color:red; color:black"><b> &nbsp;DOWNGRADE</b>&nbsp;</span>', $returnHTML);
      $returnHTML = preg_replace('/ ex-dividend|ex-dividend /i', '<span style="font-size: 12px; background-color:red; color:black"><b> &nbsp;EX-DIVIDEND (chase at 25%)</b>&nbsp;</span>', $returnHTML);
      $returnHTML = preg_replace('/ sales miss|sales miss /i', '<span style="font-size: 12px; background-color:red; color:black"><b> &nbsp;SALES MISS (Chase at 65-70%)</b>&nbsp;</span>', $returnHTML);
      $returnHTML = preg_replace('/ miss sales|miss sales /i', '<span style="font-size: 12px; background-color:red; color:black"><b> &nbsp;MISS SALES (Chase at 65-70%)</b>&nbsp;</span>', $returnHTML);
      $returnHTML = preg_replace('/ disappointing sales|disappointing sales /i', '<span style="font-size: 12px; background-color:red; color:black"><b> &nbsp;DISAPPOINTINT SALES (Chase at 65-70%)</b>&nbsp;</span>', $returnHTML);      
      $returnHTML = preg_replace('/ sales results|sales results /i', '<span style="font-size: 12px; background-color:red; color:black"><b> &nbsp;SALES RESULTS (If bad, chase at 65-70%)</b>&nbsp;</span>', $returnHTML);
      $returnHTML = preg_replace('/ 8-k/i', '<span style="font-size: 12px; background-color:red; color:black"><b> &nbsp;8-K (if it involves litigation, then back off)</b>&nbsp;</span>', $returnHTML);
      $returnHTML = preg_replace('/ accountant/i', '<span style="font-size: 12px; background-color:red; color:black"><b> &nbsp;accountant (if hiring new accountant, 35-40%)</b>&nbsp;</span>', $returnHTML);      
      $returnHTML = preg_replace('/ clinical trial/i', '<span style="font-size: 12px; background-color:red; color:black"><b> &nbsp;clinical trial</b>&nbsp;</span>', $returnHTML);            



      $beginHTML = '<html><head><link rel="stylesheet" href="./css/combined-min-1.0.5754.css" type="text/css"/>
<link type="text/css" href="./css/quote-layout.css" rel="stylesheet"/>
  <link type="text/css" href="./css/quote-typography.css" rel="stylesheet"/>
</head>
<body>
'; 
      $beginHTML .= $full_company_name[0]; 
      $beginHTML .= $returnHTML; 
      $beginHTML .= '</body></html>'; 
      $marketWatchfinalReturn = str_replace('<a ', '<a target="_blank"', $beginHTML);

      echo $marketWatchfinalReturn;       
}
else if ($which_website == "yahoo")
{
    // grab the news 

    $rss = simplexml_load_file("http://feeds.finance.yahoo.com/rss/2.0/headline?s=$symbol&region=US&lang=en-US");
    $allNews = "<ul class='newsSide'>";
    $i = 0;
    foreach ($rss->channel->item as $feedItem) {
        $i++;
        $allNews .= "<li "; 

        if ($i % 2 == 1)
        {
          $allNews .=  "style='background-color: #FFFFFF; '"; 
        };
        
        $allNews .=  " ><a href='$feedItem->link' title='$feedItem->title'> " . $feedItem->pubDate . " " . $feedItem->title . "</a></li>";
    }
    $allNews .=  "</ul>";

    echo $allNews; 


} // if ($which_website == "yahoo")
else if ($which_website == "bigcharts")
{
  $url = "http://$host_name/quickchart/quickchart.asp?symb=$symbol&insttype=&freq=1&show=&time=8"; 
  $result = grabHTML($host_name, $url);
  $html = str_get_html($result);  

  $bigChartsYestClose = $html->find('table#quote tbody tr td div'); 
  $bigChartsYestClose[4] = preg_replace('/<div>/', '<div><b>PRE MKT prev close (last)</b> - $', $bigChartsYestClose[4]); 
  $bigChartsHighLow = $html->find('td.maincontent table#quote tbody tr td div'); 

  $bigChartsReturn = $bigChartsYestClose[4]; 

  $bigChartsHigh = $bigChartsHighLow[7];
  $bigChartsLow = $bigChartsHighLow[8];      
  $bigChartsHigh = preg_replace('/<div>/', '', $bigChartsHigh); 
  $bigChartsHigh = preg_replace('/<\/div>/', '', $bigCharsHigh);       
  $bigChartsHigh = (float)$bigChartsHigh; 
  $bigChartsLow = preg_replace('/<div>/', '', $bigChartsLow);       
  $bigChartsLow = preg_replace('/<\/div>/', '', $bigChartsLow); 
  $bigChartsLow = (float)$bigChartsLow;

  $percentageChange = number_format((100*(($bigChartsHigh - $bigChartsLow)/$bigChartsLow)), 4); 

  $bigChartsHigh = number_format($bigChartsHigh, 4); 
  $bigChartsLow = number_format($bigChartsLow, 4);

  $percentageChangeText = '<br><b>&nbsp; % Change</b> - \$' . $bigChartsHigh .'/\$' . $bigChartsLow . ' = ' . $percentageChange; 

  $bigChartsReturn = preg_replace('/<\/div>/', $percentageChangeText . '%</div>', $bigChartsReturn); 

  echo $bigChartsReturn; 

} // if ($which_website == "bigcharts")
else if ($which_website == "etrade")
{

  $url =  "www.etrade.wallst.com/v1/stocks/news/search_results.asp?symbol=$symbol&rsO=new";

  $result = grabEtradeHTML("www.etrade.wallst.com", $url);
  $html = str_get_html($result);  
  $eTradeNewsDiv = $html->find('#news_story');

  $returnEtradeHTML = $eTradeNewsDiv[0]; 
  $returnEtradeHTML = preg_replace('/<div class="fRight newsSideWidth t10">(.*)<div class="clear"><\/div>/', '', $returnEtradeHTML); 
  $returnEtradeHTML = preg_replace('/width:306px;/', 'width:600px;', $returnEtradeHTML); 

  echo $returnEtradeHTML; 
}

?>