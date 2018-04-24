/**
 * @File: popup.js
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
var DB_FLAG = false

function DB() {
    if (DB_FLAG == false)
        return;
    var str = '';
    for (var i = 0; i < arguments.length; i++)
        str += arguments[i] + ' ';
    console.log(str);
}


// From http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery 
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};



/* finds the intersection of 
 * two arrays in a simple fashion.  
 *
 * PARAMS
 *  a - first array, must already be sorted
 *  b - second array, must already be sorted
 *
 * NOTES
 *
 *  Should have O(n) operations, where n is 
 *    n = MIN(a.length(), b.length())
 */
function intersect_safe(a, b) {
    DB('a in intersect_safe is', a)
    DB('b in intersect_safe is', b)
    var ai = 0,
        bi = 0;
        
    //var a = a.slice();
    var bc = b.slice();
    DB('bc in intersect_safe is', bc)
    //a.sort()
    bc.sort(function(a, b){return a-b});
    DB('bc in intersect_safe is', bc)
    
    var result = new Array();
    

    while (ai < a.length && bi < bc.length) {
        if (a[ai] < bc[bi]) {
            ai++;
        } else if (a[ai] > bc[bi]) {
            bi++;
        } else /* they're equal */ {
            result.push(a[ai]);
            ai++;
            bi++;
        }
    }
    DB('a in intersect_safe is', a)
    DB('bc in intersect_safe is', bc)
    DB('result in intersect_safe is', result)
    return result;
}


$('input[type="checkbox"]').on('change', function() {
    $('input[name="' + this.name + '"]').not(this).prop('checked', false);
});


var background = chrome.extension.getBackgroundPage();
var cat_set_elem = document.getElementById('cat_span');
var priva_span_elem = document.getElementById('priva_span');
var disagree_span_elem = document.getElementById('disagree_span');
var future_div = document.getElementById('future');
var trackers_div = document.getElementById('div_trackers');
var disagree_link = document.getElementById('disagree_link');
var configure_options = document.getElementById('configure_options');
var linkElem = document.getElementById('list_trackers');
var block_connections_selection_elem = document.getElementById('block_connections');
var allow_connections_selection_elem = document.getElementById('allow_connections');
var div_footer = document.getElementById('footer');


var query = {
    active: true,
    currentWindow: true
};

configure_options.onclick = function() {
    chrome.runtime.openOptionsPage();
}


function callback(tabs) {
    var currentTab = tabs[0];
    DB('currentTab.id is', currentTab.id);
    
    var url = chrome.extension.getURL('list_trackers.html')
    url = url + '?tabid=' + currentTab.id;
    linkElem.href = url;
    linkElem.target = '_blank';
        
    url = chrome.extension.getURL('input_form.html')
    url = url + '?tabid=' + currentTab.id;
    disagree_link.href = url;
    disagree_link.target = '_blank';
    
    
    
    if (!background.tabs_info[currentTab.id]) {
       cat_set_elem.innerHTML = "Not categorized"; 
       //Please visit a http(s) page or if http(s) please reload this page."; 
       disagree_span_elem.innerHTML = '';
       future_div.parentNode.removeChild(future_div);
       trackers_div.parentNode.removeChild(trackers_div);
       
       priva_span_elem.innerHTML = "No decision for this page yet."; 
       return;
    } else if (background.tabs_info[currentTab.id].topcatList.length == 0) {
        cat_set_elem.innerHTML = "Page not yet categorized"; 
        disagree_span_elem.innerHTML = '';
        priva_span_elem.innerHTML = "No decision for this page yet.";
        return;
    }
    
    
    if (background.tabs_info[currentTab.id]) {
        
        var br_elem = document.createElement('br');
        div_footer.appendChild(br_elem);
        br_elem = document.createElement('br');
        div_footer.appendChild(br_elem);
        
        var report_link_elem = document.createElement('a');
        report_link_elem.id = "report_broken_link";
        report_link_elem.innerHTML = "You think current page broke due to MyTrackingChoices?";
        var center_elem = document.createElement('center');
        center_elem.appendChild(report_link_elem)
        
        div_footer.appendChild(center_elem);
        
        var report_broken_link = document.getElementById('report_broken_link');
        
        url = chrome.extension.getURL('report_broken.html')
        url = url + '?tabid=' + currentTab.id;
        report_broken_link.href = url;
        report_broken_link.target = '_blank';
        
        
        var current_url = background.tabs_info[currentTab.id].url;
        var current_url_hash = new String(current_url).hashCode();
        
        
        if (current_url_hash in background.per_url_policy) {
            DB('current_url is in per_url_policy');
            var result = background.per_url_policy[current_url_hash];
            if (result == 'conns_allow') {
                allow_connections_selection_elem.checked = true;
            } else {
                block_connections_selection_elem.checked = true;
            }
        }
        
        
        allow_connections_selection_elem.onclick = function() {
            DB('inside allow connections...');
            if (this.checked) {
                background.per_url_policy[current_url_hash] = 'conns_allow';
                chrome.storage.local.set({'per_url_policy': background.per_url_policy});
            } else {
                delete background.per_url_policy[current_url_hash];
                chrome.storage.local.set({'per_url_policy': background.per_url_policy});
            }
        }
        
        block_connections_selection_elem.onclick = function() {
            DB('inside block connections...');
            if (this.checked) {
                background.per_url_policy[current_url_hash] = 'conns_block';
                chrome.storage.local.set({'per_url_policy': background.per_url_policy});
            } else {
                delete background.per_url_policy[current_url_hash];
                chrome.storage.local.set({'per_url_policy': background.per_url_policy});
            }
        }
        
        
        var topcatList = background.tabs_info[currentTab.id].topcatList
    
        cat_set_elem.innerHTML = '';
        for (var xx = 0; xx < topcatList.length; xx++) {
            
            var color_str = '';
            if (background.list_topcats_to_block_network_conns.indexOf(topcatList[xx]) > -1) {
                color_str = 'red';
            } else {
                color_str = 'green';
            }
            
            if (xx == 0) {
                var tmp_span = document.createElement('span');
                tmp_span.style.color = color_str
                tmp_span.innerHTML = '"' + mapping_code_topcat[topcatList[xx]] + '"'
                cat_set_elem.appendChild(tmp_span);
                continue
            }
            
            if (xx != 0 && xx == topcatList.length - 1) {
                var tmp_span = document.createElement('span');
                tmp_span.style.color = 'black';
                tmp_span.innerHTML = ' and ';
                cat_set_elem.appendChild(tmp_span);
                
                var tmp_span = document.createElement('span');
                tmp_span.style.color = color_str
                tmp_span.innerHTML = '"' + mapping_code_topcat[topcatList[xx]] + '"'
                cat_set_elem.appendChild(tmp_span);
            } else {
                var tmp_span = document.createElement('span');
                tmp_span.style.color = 'black';
                tmp_span.innerHTML = ', ';
                cat_set_elem.appendChild(tmp_span);
                
                var tmp_span = document.createElement('span');
                tmp_span.style.color = color_str
                tmp_span.innerHTML = '"' + mapping_code_topcat[topcatList[xx]] + '"'
                cat_set_elem.appendChild(tmp_span);
            }

        }
       
        var trackers = background.tabs_info[currentTab.id].trackers;
        if ((current_url_hash in background.per_url_policy) && background.per_url_policy[current_url_hash] == 'conns_allow') {
            var str_display = trackers.length+' trackers were Not blocked on this page! (N)'
            priva_span_elem.style.color = 'green';
            priva_span_elem.innerHTML = str_display;
        } else if (intersect_safe(background.list_topcats_to_block_network_conns, topcatList).length > 0 || ((current_url_hash in background.per_url_policy) && background.per_url_policy[current_url_hash] == 'conns_block')) {
            var str_display = trackers.length+' trackers were Blocked on this page! (B)'
            priva_span_elem.style.color = 'red';
            priva_span_elem.innerHTML = str_display;
        } else {
            var str_display = trackers.length+' trackers were Not blocked on this page! (N)'
            priva_span_elem.style.color = 'green';
            priva_span_elem.innerHTML = str_display;
        }
    }
}

chrome.tabs.query(query, callback);