 /**
 * @File: content_allframes.js
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




/* Listen for messages */
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
   if (msg.text && (msg.text == 'iframes_src_detection')) {
        DB('msg is received from background page for iframe: ', document.URL)
        //DB('all document.location is', document.location);
        sendResponse([document.URL, msg.frameId]);
    } 
});