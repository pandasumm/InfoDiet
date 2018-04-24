/**
* @File: priva_policy.js
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

var optout = document.getElementById('optout');
optout.onclick = opt_out;

var optout_cancel = document.getElementById('optout_cancel');
optout_cancel.onclick = optout_cancel_func;


function opt_out() {
   chrome.storage.local.set({'opt_out':true});
   return true;
}


function optout_cancel_func() {
   chrome.storage.local.set({'opt_out':false});
   return true;
}
