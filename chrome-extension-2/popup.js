var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-45267314-2']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var config = new Config();
var gsites = new Sites(config);


function addIgnoredSite(new_site) {
  return function() {
    chrome.extension.sendRequest(
       {action: "addIgnoredSite", site: new_site},
       function(response) {
         initialize();
       });
  };
}

function secondsToString(seconds) {
  if (config.timeDisplayFormat == Config.timeDisplayFormatEnum.MINUTES) {
    return (seconds/60).toFixed(2);
  }
  var years = Math.floor(seconds / 31536000);
  var days = Math.floor((seconds % 31536000) / 86400);
  var hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  var mins = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  var secs = (((seconds % 31536000) % 86400) % 3600) % 60;
  var s = "";
  if (years) {
    s = s + " " + years + "y";
  }
  if (days) {
    s = s + " " + days + "d";
  }
  if (hours) {
    s = s + " " + hours + "h";
  }
  if (mins) {
    s = s + " " + mins + "m";
  }
  if (secs) {
    s = s + " " + secs.toFixed(0) + "s";
  }
  return s;
}

function calculateReadingTime(website, currTime) {
  var avgReadingSpeed = 200; //avg reading speed of an adult is 200 words/minute
  var totalWords = 0; // find length of main article/piece of reading on the webpage
  var time = Math.min(totalWords/avgReadingSpeed, currTime);
  return time;
}

function categorize(site_url) {
  url = site_url;
  var MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

  var xhr = new XMLHttpRequest();
  var url_base64 = btoa(url);
  console.log(url_base64);
  var s_key = "uIopvgpM4rOIQ17cnKeu";
  var a_key = "zNyOSgk05CbrLPR8R6Qx";
  request = "categories/v3/"+url_base64 + "?key=" + a_key;
  var hash = MD5(s_key + ":" + request);
  console.log(hash)

  var curl = "https://api.webshrinker.com/" + request +  "&hash=" + hash
  xhr.open("GET", curl, false);
  xhr.send();

  var result = xhr.responseText;
  myArr = JSON.parse(result);
  return myArr.data[0].categories[0].label;
}


function addLocalDisplay() {
  var old_tbody = document.getElementById("stats_tbody");
  var tbody = document.createElement("tbody");
  tbody.setAttribute("id", "stats_tbody");
  old_tbody.parentNode.replaceChild(tbody, old_tbody);

  /* Sort sites by time spent */
  var sites = gsites.sites; //all the sites you've visited so far
  var sortedSites = new Array();
  var totalTime = 0;

  for (site in sites) {
   sortedSites.push([site, sites[site]]);
   totalTime += sites[site];
  }
  sortedSites.sort(function(a, b) {
   return b[1] - a[1];
  });

  /* Show only the top 15 sites by default */
  var max = 15;
  if (document.location.href.indexOf("show=all") != -1) {
   max = sortedSites.length;
  }

  /* Add total row. */
  var row = document.createElement("tr");
  var cell = document.createElement("td");
  cell.innerHTML = "<b>Total</b>";
  row.appendChild(cell);
  cell = document.createElement("td");
  cell.appendChild(document.createTextNode(secondsToString(totalTime)));
  row.appendChild(cell);
  cell = document.createElement("td");
  cell.appendChild(document.createTextNode(("100")));
  row.appendChild(cell);
  row = setPercentageBG(row,0);
  tbody.appendChild(row);

  var maxTime = 0;
  if (sortedSites.length) {
    maxTime = sites[sortedSites[0][0]];
  }
  var relativePct = 0;

  // object to keep track of various categories and time spent on each
  var categories = {};
  var categoriesRows = {};
  var rowCount = 1;

  for (var index = 0; ((index < sortedSites.length) && (index < max));
      index++ ){

   var site = sortedSites[index][0];

   var currCategory = categorize(site);
   // var currCategory = "fake cat1";
   // var d = new Date();
   // var n = d.getTime();
   // if(n % 2 == 0){
   //     currCategory = "fake dog";
   // }

   var currTime = sites[site];

   if (!(currCategory in categories)) {

       categories[currCategory] = currTime;
       categoriesRows[currCategory] = rowCount;
       rowCount++;

       row = document.createElement("tr");
       row.setAttribute("id", currCategory);
       cell = document.createElement("td");
       var removeImage = document.createElement("img");
       removeImage.src = chrome.extension.getURL("images/remove.png");
       removeImage.title = "Remove and stop tracking.";
       removeImage.width = 10;
       removeImage.height = 10;
       removeImage.onclick = addIgnoredSite(site);
       cell.appendChild(removeImage);
       var h = document.createElement('h');
       // var linkText = document.createTextNode(site+": "+categorize(site));
       var linkText = document.createTextNode(currCategory);
       h.appendChild(linkText);
       //h.title = "Open link in new tab";
       cell.appendChild(h);
       row.appendChild(cell);
       cell = document.createElement("td");
       cell.setAttribute("id", currCategory + "2");
       cell.appendChild(document.createTextNode(secondsToString(categories[currCategory])));
       row.appendChild(cell);
       cell = document.createElement("td");
       cell.setAttribute("id", currCategory + "3");
       cell.appendChild(document.createTextNode(
         (categories[currCategory] / totalTime * 100).toFixed(2)));
       relativePct = (categories[currCategory]/maxTime*100).toFixed(2);
       row = setPercentageBG(row,relativePct);
       row.appendChild(cell);
       tbody.appendChild(row);
   }
   else {
       console.log(currTime);
       console.log(categories[currCategory]);
       categories[currCategory] = categories[currCategory] + currTime;
       row = document.getElementById(currCategory);
       cell = document.getElementById(currCategory + "2");
       cell.removeChild(cell.childNodes[0]);
       cell.appendChild(document.createTextNode(secondsToString(categories[currCategory])));
       cell = document.getElementById(currCategory + "3");
       cell.removeChild(cell.childNodes[0]);
       cell.appendChild(document.createTextNode(
         (categories[currCategory] / totalTime * 100).toFixed(2)));
       relativePct = (categories[currCategory]/maxTime*100).toFixed(2);
       row = setPercentageBG(row,relativePct);
       row.removeChild(row.childNodes[2]);
       row.appendChild(cell);
       //tbody.removeChild(tbody.childNodes[0]);
       tbody.appendChild(row);
   }

   // row = document.createElement("tr");
   // cell = document.createElement("td");
   // var removeImage = document.createElement("img");
   // removeImage.src = chrome.extension.getURL("images/remove.png");
   // removeImage.title = "Remove and stop tracking.";
   // removeImage.width = 10;
   // removeImage.height = 10;
   // removeImage.onclick = addIgnoredSite(site);
   // cell.appendChild(removeImage);
   // var h = document.createElement('h');

   // // var linkText = document.createTextNode(site+": "+categorize(site));
   // var currCategory = categorize(site);
   // var linkText = document.createTextNode(currCategory);
   // var currTime = sites[site];

   // h.appendChild(linkText);
   // //h.title = "Open link in new tab";
   // //h.href = site;
   // //h.target = "_blank";
   // cell.appendChild(h);
   // row.appendChild(cell);
   // cell = document.createElement("td");
   // cell.appendChild(document.createTextNode(secondsToString(sites[site])));
   // // cell.appendChild(document.createTextNode(secondsToString(categories[currCategory])));
   // row.appendChild(cell);
   // cell = document.createElement("td");
   // cell.appendChild(document.createTextNode(
   //   (sites[site] / totalTime * 100).toFixed(2)));
   // relativePct = (sites[site]/maxTime*100).toFixed(2);
   // // cell.appendChild(document.createTextNode(
   // //   (categories[currCategory] / totalTime * 100).toFixed(2)));
   // // relativePct = (categories[currCategory]/maxTime*100).toFixed(2);
   // row = setPercentageBG(row,relativePct);
   // row.appendChild(cell);
   // tbody.appendChild(row);
  }

  /* Show the "Show All" link if there are some sites we didn't show. */
  if (max < sortedSites.length && document.getElementById("show") == null) {
    /* Add an option to show all stats */
    var showAllLink = document.createElement("a");
    showAllLink.onclick = function() {
     chrome.tabs.create({url: "popup.html?show=all"});
    }
    showAllLink.setAttribute("id", "show");
    showAllLink.setAttribute("href", "javascript:void(0)");
    showAllLink.setAttribute("class", "pure-button");
    showAllLink.appendChild(document.createTextNode("Show All"));
    document.getElementById("button_row").appendChild(showAllLink);
  } else if (document.getElementById("show") != null) {
    var showLink = document.getElementById("show");
    showLink.parentNode.removeChild(showLink);
  }
}

function setPercentageBG(row,pct) {
  var color = "#e8edff";
  row.style.backgroundImage = "-webkit-linear-gradient(left, "+color+" "+pct+"%,#ffffff "+pct+"%)";
  row.style.backgroundImage = "    -moz-linear-gradient(left, "+color+" "+pct+"%, #ffffff "+pct+"%)";
  row.style.backgroundImage = "     -ms-linear-gradient(left, "+color+" "+pct+"%,#ffffff "+pct+"%)";
  row.style.backgroundImage = "      -o-linear-gradient(left, "+color+" "+pct+"%,#ffffff "+pct+"%)";
  row.style.backgroundImage = "         linear-gradient(to right, "+color+" "+pct+"%,#ffffff "+pct+"%)";
  return row;
}

function sendStats() {
  chrome.extension.sendRequest({action: "sendStats"}, function(response) {
   /* Reload the iframe. */
   var iframe = document.getElementById("stats_frame");
   iframe.src = iframe.src;
  });
}

function clearStats() {
  chrome.extension.sendRequest({action: "clearStats"}, function(response) {
   initialize();
  });
}

function initialize() {
  addLocalDisplay();

  if (config.lastClearTime) {
    var div = document.getElementById("lastClear");
    if (div.childNodes.length == 1) {
      div.removeChild(div.childNodes[0]);
    }
    div.appendChild(
      document.createTextNode("Last Reset: " + new Date(
        config.lastClearTime).toString()));
  }

  var nextClearStats = config.nextTimeToClear;
  if (nextClearStats) {
   nextClearStats = parseInt(nextClearStats, 10);
   nextClearStats = new Date(nextClearStats);
   var nextClearDiv = document.getElementById("nextClear");
   if (nextClearDiv.childNodes.length == 1) {
     nextClearDiv.removeChild(nextClearDiv.childNodes[0]);
   }
   nextClearDiv.appendChild(
     document.createTextNode("Next Reset: " + nextClearStats.toString()));
  }
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("clear").addEventListener("click",
    function() { if (confirm("Are you sure?")) { clearStats(); }});
  document.getElementById("options").addEventListener("click",
      function() { chrome.runtime.openOptionsPage(); });
  var buttons = document.querySelectorAll("button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function(e) {
      _gaq.push(["_trackEvent", e.target.id, "clicked"]);
    });
  }
  initialize();
});
