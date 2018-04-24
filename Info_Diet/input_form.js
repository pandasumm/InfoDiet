/**
* @File: input_form.js
* @Author: Jagdish Prasad ACHARA
* @Date: December 2015.
*/
/**
(* *********************************************************************)
(*                                                                     *)
(*              The MyTrackingChoices extension                        *)
(*                                                                     *)
(*                                                                     *)
(*  Copyright Institut National de Recherche en Informatique et en     *)
(*  Automatique.  All rights reserved. This file is distributed        *)
(*  under the terms of the INRIA Non-Commercial License Agreement.     *)
(*                                                                     *)
(* *********************************************************************)
*/


//var DB_FLAG = true;
var DB_FLAG = false;

function DB() {
   if (DB_FLAG == false)
       return;
   var str = '';
   for (var i = 0; i < arguments.length; i++)
       str += arguments[i] + ' ';
   console.log(str);
}


var QueryString = function () {
 // This function is anonymous, is executed immediately and
 // the return value is assigned to QueryString!
 var query_string = {};
 var query = window.location.search.substring(1);
 var vars = query.split("&");
 for (var i=0;i<vars.length;i++) {
   var pair = vars[i].split("=");
       // If first entry with this name
   if (typeof query_string[pair[0]] === "undefined") {
     query_string[pair[0]] = decodeURIComponent(pair[1]);
       // If second entry with this name
   } else if (typeof query_string[pair[0]] === "string") {
     var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
     query_string[pair[0]] = arr;
       // If third or later entry with this name
   } else {
     query_string[pair[0]].push(decodeURIComponent(pair[1]));
   }
 }
   return query_string;
}();

var background = chrome.extension.getBackgroundPage();
var urlPara = document.getElementById('url');
urlPara.style.fontSize = 'medium';

var notify_cat_correction_selection_elem = document.getElementById('notify_cat_correction');

if (QueryString.tabid) {
   var tabid = parseInt(QueryString.tabid);
   urlPara.innerHTML = background.tabs_info[tabid].url
}

var submitButton = document.getElementById('button');
submitButton.onclick=function () {
   //alert('hahahaha');
   // get the selected value of category...
   var e = document.getElementById("selectId");
   var strCat = e.options[e.selectedIndex].value;
   var userUrlCats = {};
   //DB('localStorage.userUrlCats is:',localStorage.userUrlCats)
   if (localStorage.userUrlCats) {
       userUrlCats = JSON.parse(localStorage.userUrlCats);
   }
   //DB('userUrlCats is:',JSON.stringify(userUrlCats))
   //DB('QueryString.url is:', background.tabs_info[parseInt(QueryString.tabid)].url);
   var tab_url = background.tabs_info[parseInt(QueryString.tabid)].url;
   userUrlCats[tab_url] = parseInt(strCat)
   //DB('userUrlCats is:',JSON.stringify(userUrlCats))
   localStorage.userUrlCats = JSON.stringify(userUrlCats)
   //DB('localStorage.userUrlCats is:',localStorage.userUrlCats)

   var ct = Date.now();
   var main_data;
   if (notify_cat_correction_selection_elem.checked) {
       main_data = JSON.stringify({
           url: tab_url,
           cat: parseInt(strCat),
           uid: background.uid,
           ct: ct
       });
   } else {
       main_data = JSON.stringify({
           url: 'NotShared',
           cat: -1,
           uid: background.uid,
           ct: ct
       });
   }

   background.notify_cat_correction(main_data);

   window.close();
}
