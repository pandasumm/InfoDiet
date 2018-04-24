/**
* @File: list_trackers.js
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

var urlPara = document.getElementById('url');
var trackersPara = document.getElementById('para_trackers_list');

//DB('QueryString.tabid is ', QueryString.tabid);
var tabId = parseInt(QueryString.tabid);
//DB('tabId is', tabId);
var background = chrome.extension.getBackgroundPage();
if (!background.tabs_info[tabId]) {
   urlPara.innerHTML = "No information available for this tab.";
} else {
   urlPara.style.fontSize = 'large';
   urlPara.innerHTML = background.tabs_info[tabId].url;
   var trackers_list = background.tabs_info[tabId].trackers
   DB('trackers_list is', trackers_list);
   for (var i = 0; i < trackers_list.length; i++) {
       var bold_elem = document.createElement('span');
       bold_elem.style.fontSize = 'large';
       bold_elem.innerHTML = trackers_list[i];
       trackersPara.appendChild(bold_elem)

       var br_elem = document.createElement('br');
       trackersPara.appendChild(br_elem)
   }
}
