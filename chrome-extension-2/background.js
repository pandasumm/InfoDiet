var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-45267314-2']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function clearStats() {
  if (config.clearStatsInterval < 3600) {
    config.nextTimeToClear = 0;
    return;
  }

  if (!config.nextTimeToClear) {
    var d = new Date();
    d.setTime(d.getTime() + config.clearStatsInterval * 1000);
    d.setMinutes(0);
    d.setSeconds(0);
    if (config.clearStatsInterval > 3600) {
      d.setHours(0);
    }
    config.nextTimeToClear = d.getTime();
  }
  var now = new Date();
  if (now.getTime() > config.nextTimeToClear) {
    sites.clear();
    var nextTimeToClear = new Date(nextTimeToClear + config.clearStatsInterval * 1000);
    config.nextTimeToClear = nextTimeToClear.getTime();
    return;
  }
}

var config = new Config();
var sites = new Sites(config);
var tracker = new Tracker(config, sites);

/* Listen for requests which come from the user through the popup. */
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "clearStats") {
      sites.clear();
      sendResponse({});
    } else if (request.action == "addIgnoredSite") {
      config.addIgnoredSite(request.site);
      sendResponse({});
    } else {
      console.log("Invalid action given: " + request.action);
    }
  });

chrome.alarms.create("clearStats", {periodInMinutes: 2});
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == "clearStats") {
    clearStats(config);
  }
});



/**
 * @File: background.js
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





var NO_SUB_CATS = Object.keys(mapping_subcat_code).length;
var NO_TOP_CATS = Object.keys(mapping_topcat_code).length;

// weight for words...
WT_FP_EN = 3
WT_EN = 1
WT_ES = 1
WT_IT = 1
WT_FR = 1

// weights for title, url, kw and content
WT_URL = 50
WT_TITLE = 90
WT_KWS = 100
WT_CONTENT = 1



var counter_for_iframe_response_tracking = {};
var counter_for_received_response = {};
var HOST = 'https://myrealonlinechoices.inrialpes.fr/'


// We still need to have a minimalistic list of domains for sites to work.
// About 'cloudflare.com', I'm not sure if it is just for jquery. This domain might also be used to deliver ads, so I didn't include it.
var allowed_thirdparty_domains = {
	"all_domains": ["twitter.com", "facebook.net", "fonts.googleapis.com", "maps.googleapis.com", "gravatar.com", "sstatic.net", "bootstrapcdn.com", "jquery.com", "aspnetcdn.com", "jsdelivr.net", "ajax.googleapis.com", "wordpress.com", "wp.com", "googleusercontent.com", "gstatic.com", "www.google.com", "apis.google.com", "plus.google.com"],
	"facebook.com": ["fbcdn.net"],
	"twitter.com": ["twimg.com"],
	"youtube.com": ["ytimg.com", "googlevideo.com"],
	"lemonde.fr": ["lemde.fr"],
	"gaana.com": ["akamaihd.net"],
	"linkedin.com": ["licdn.com"],
        "slideshare.net": ["slidesharecdn.com"]
	};



// Below two variables can be completed with http://www.sitepoint.com/web-foundations/mime-types-complete-list/

var file_exts_not_to_be_categorized = [".pdf", ".png", ".jpg", ".jpeg", ".gz", ".zip", ".cab", ".7z", ".bik", ".bz2", ".dmg", ".egg", ".ipg", ".par", ".iso", ".img", ".dsk", ".adf", ".d64", ".sdi", ".pkg", ".exe", ".ogg", ".ogv", ".oga", ".ogx", ".ogm", ".spx", ".opus", ".js", ".json", ".gif", ".tiff", ".css", ".csv", "mpeg", ".mp4", ".flv", ".webm", ".wmv"];


var content_types_not_to_be_categorized = [
        "application/octet-stream",
        "application/javascript",
        "application/EDI-X12",
        "application/EDIFACT",
        "application/ogg",
        "video/ogg",
        "audio/ogg",
        "application/pdf",
        "application/x-shockwave-flash",
        "application/zip",
        "application/json",
        "audio/mpeg",
        "audio/x-ms-wma",
        "audio/vnd.rn-realaudio",
        "audio/x-wav",
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/tiff",
        "image/vnd.microsoft.icon",
        "image/vnd.djvu",
        "image/svg+xml",
        "multipart/mixed",
        "multipart/alternative",
        "multipart/related",
        "text/css",
        "text/csv",
        "text/javascript",
        "video/mpeg",
        "video/mp4",
        "video/quicktime",
        "video/x-ms-wmv",
        "video/x-msvideo",
        "video/x-flv",
        "video/webm"
        ];

function stringStartsWith (string, prefix) {
    return string.slice(0, prefix.length) == prefix;
}

function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
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


// from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};


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
    var ai = 0,
        bi = 0;

    var bc = b.slice();

    bc.sort(function(a, b){return a-b});

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
    return result;
}

var cache_url_to_cat = {};

var l = document.createElement("a");

var tabs_info = {}



function report_broken(main_data) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', HOST + 'cgi-bin/report_broken.py', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                //DB('Data SENT!');
                DB('xhr.responseText is', xhr.responseText)
                //user_profile_to_upload = []
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(main_data);
}

function notify_cat_correction(main_data) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', HOST + 'cgi-bin/cat_correction_upload.py', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                //DB('Data SENT!');
                DB('xhr.responseText is', xhr.responseText)
                //user_profile_to_upload = []
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(main_data);
}


chrome.alarms.create("sync_list", {delayInMinutes: 1, periodInMinutes: 15} );

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
        //chrome.storage.local.clear();
        chrome.runtime.openOptionsPage();
    }
});

chrome.alarms.onAlarm.addListener(function(alarm) {

  //alert("Beep");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", HOST + "allowed_thirdparty_domains.json", true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                //DB('xhr.responseText is', xhr.responseText)
                var response = JSON.parse(xhr.responseText);
                allowed_thirdparty_domains = response["allowed_thirdparty_domains"]
                //DB('allowed_thirdparty_domains are', allowed_thirdparty_domains)
            }
        }
    }

    xhr.send();




    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", HOST + "file_exts_not_to_be_categorized.json", true);

    xhr2.onreadystatechange = function() {
        if (xhr2.readyState == 4) {
            if (xhr2.status == 200) {
                //DB('xhr2.responseText is', xhr2.responseText)
                var response = JSON.parse(xhr2.responseText);
                file_exts_not_to_be_categorized = response["file_exts_not_to_be_categorized"]
                //DB('file_exts_not_to_be_categorized are', file_exts_not_to_be_categorized)
            }
        }
    }

    xhr2.send();



    var xhr3 = new XMLHttpRequest();
    xhr3.open("GET", HOST + "content_types_not_to_be_categorized.json", true);

    xhr3.onreadystatechange = function() {
        if (xhr3.readyState == 4) {
            if (xhr3.status == 200) {
                //DB('xhr3.responseText is', xhr3.responseText)
                var response = JSON.parse(xhr3.responseText);
                content_types_not_to_be_categorized = response["content_types_not_to_be_categorized"]
                //DB('content_types_not_to_be_categorized are', content_types_not_to_be_categorized)
            }
        }
    }

    xhr3.send();

});


var trackers_decision, uid, list_topcats_to_block_network_conns, cache_url_to_cat, opt_out, user_profile_to_upload, per_url_policy;

chrome.storage.local.get(['trackers_decision' ,'uid', 'list_topcats_to_block_network_conns', 'cache_url_to_cat', 'opt_out', 'per_url_policy', 'user_profile_to_upload'], function(result) {

    if (result.trackers_decision == undefined) {
        trackers_decision = {};
        chrome.storage.local.set({
            'trackers_decision': trackers_decision
        });
    } else {
        trackers_decision = result.trackers_decision;
    }


    if (result.uid == undefined) {
        uid = generateUUID()
        chrome.storage.local.set({
            'uid': uid
        });
    } else {
        uid = result.uid;
    }


    if (result.user_profile_to_upload == undefined) {
        user_profile_to_upload = []
        chrome.storage.local.set({
            'user_profile_to_upload': user_profile_to_upload
        });
    } else {
        user_profile_to_upload = result.user_profile_to_upload
    }


    if (result.per_url_policy == undefined) {
        per_url_policy = {};
        chrome.storage.local.set({
            'per_url_policy': per_url_policy
        });
    } else {
        per_url_policy = result.per_url_policy;
    }


    if (result.list_topcats_to_block_network_conns == undefined) {
        list_topcats_to_block_network_conns = []
        chrome.storage.local.set({
            'list_topcats_to_block_network_conns': list_topcats_to_block_network_conns
        });
    } else {
        list_topcats_to_block_network_conns = result.list_topcats_to_block_network_conns
    }


    if (result.cache_url_to_cat == undefined) {
        cache_url_to_cat = {}
        chrome.storage.local.set({
            'cache_url_to_cat': cache_url_to_cat
        });
    } else {
        cache_url_to_cat = result.cache_url_to_cat
    }


    if (result.opt_out == undefined) {
        opt_out = false
        chrome.storage.local.set({
            'opt_out': opt_out
        });
    } else {
        opt_out = result.opt_out;
    }
});



function submit_data_interval() {


    var ct = Date.now();

    var main_data = JSON.stringify({
        user_profile_to_upload: user_profile_to_upload,
        uid: uid,
        ct: ct
    });


    var xhr = new XMLHttpRequest();
    xhr.open('POST', HOST + '/cgi-bin/block_pref_upload.py', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                //DB('Data SENT!');
                //DB('xhr.responseText is', xhr.responseText)
                user_profile_to_upload = []
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(main_data);
}



function submit_data(type, list) {

    var ct = Date.now();

    if (type == 'list_topcats_to_block_network_conns') {
        var main_data = JSON.stringify({
            list_topcats_to_block_network_conns: list,
            uid: uid,
            ct: ct
        });
    } else {
        var main_data = JSON.stringify({
            per_url_policy: list,
            uid: uid,
            ct: ct
        });
    }


    var xhr = new XMLHttpRequest();
    xhr.open('POST', HOST + '/cgi-bin/block_pref_upload.py', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                DB('Data SENT!');
                //DB('xhr.responseText is', xhr.responseText)
            }
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(main_data);
}



chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        if (key == 'opt_out') {
            opt_out = storageChange.newValue
        } else if (key == 'list_topcats_to_block_network_conns') {
            list_topcats_to_block_network_conns = storageChange.newValue
            if (!opt_out) {
                submit_data('list_topcats_to_block_network_conns',list_topcats_to_block_network_conns);
            }
        } else if (key == 'per_url_policy') {
            per_url_policy = storageChange.newValue
            if (!opt_out) {
                submit_data('per_url_policy', per_url_policy);
            }
        }

        //          console.log('Storage key "%s" in namespace "%s" changed. ' +
        //                      'Old value was "%s", new value is "%s".',
        //                      key,
        //                      namespace,
        //                      storageChange.oldValue,
        //                      storageChange.newValue);
    }
});




setInterval(function() {
    if (!opt_out) {
        submit_data_interval();
    }
//}, 150000);
//}, 3600000);
}, 600000);
//300000 milliseconds = 5 minutes



function processResponseAndGetCat(url,responseText) {
    // To remove script code...
    // Source: http://stackoverflow.com/questions/888875/how-to-parse-html-from-javascript-in-firefox
    responseText = responseText.replace(/<script(.|\s)*?\/script>/g, '');

    // Get the title
    var doc = new DOMParser().parseFromString(responseText, 'text/html');
    var title = doc.querySelector('head > title');
    title = title ? title.textContent : '';
    //DB('title of the page is:', title);

    var kws = doc.querySelector('head > meta[name="keywords"]');
    kws = kws ? kws.textContent : '';
    //DB('kws of the page is:', kws);

    var content = doc.querySelector('body');
    //content = content ? content.innerText : '';
    content = content ? content.textContent : '';
    //DB('visible_content is =', content);

    var params_obj = {
        url: url,
        title: title,
        kws: kws,
        content: content
    };

    var catList = webPageClassifier.classify(params_obj);
    // Update Cache
    cache_url_to_cat[url] = catList
    chrome.storage.local.set({
        'cache_url_to_cat': cache_url_to_cat
    });

    //DB('catList is (in processResponseAndGetCat)', catList);

    return catList;
}


var parseURL = new ParseURL;
var webPageClassifier = new WebPageClassifier;



chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        var current_tabId = details.tabId;

        // If it's not a tab related request, return immediately
        if (current_tabId == -1)
            return {
                requestHeaders: details.requestHeaders
            };

        var current_type = details.type;
        var current_url = details.url;
        var current_domain = parseURL.parse(current_url).domain;

        //DB('current_tabId is', current_tabId)
        //DB('current_type is', current_type)
        //DB('current_url is', current_url)
        //DB('current_domain is', current_domain)

        // If it is a request from a user navigated tab...
        if (current_type == 'main_frame') {


            for (var index = 0; index < file_exts_not_to_be_categorized.length; index++) {
                l.href = current_url;
                if (l.pathname.toLowerCase().endsWith(file_exts_not_to_be_categorized[index])) {
                    delete tabs_info[current_tabId];
                    return;
                }
            }

            var topcatList = [];
            if (localStorage.userUrlCats) {
                //DB('localStorage.userUrlCats is ', localStorage.userUrlCats);
                var userUrlCats = JSON.parse(localStorage.userUrlCats)
                if (userUrlCats.hasOwnProperty(current_url)) {
                    topcatList.push(userUrlCats[current_url])
                }
            }

            if (topcatList.length == 0) {
                var catList = [];
                if (current_url in cache_url_to_cat) {
                    catList = cache_url_to_cat[current_url]
                } else {
                    catList = webPageClassifier.classify_basedOnUrlList(current_url);
                }

                if (catList.length == 1 && catList[0] == -1) {

                    var request = new XMLHttpRequest();
                    request.open('GET', current_url, false);  // 'false' makes the request synchronous
                    request.send(null);

                    //DB('request.status is', request.status);
                    if (request.status === 200) {
                        if (request.getResponseHeader("Content-Type")) {
                            for (var index = 0; index < content_types_not_to_be_categorized.length; index++) {
                                if (request.getResponseHeader("Content-Type") == content_types_not_to_be_categorized[index]) {
                                    delete tabs_info[current_tabId];
                                    return;
                                }

                            }
                        }

                        //DB('request.responseText is', request.responseText);
                        catList = processResponseAndGetCat(current_url,request.responseText)
                    }
                }

                if (catList.length >= 0 && catList[0] != -1) {
                    for (var xx = 0; xx < catList.length; xx++) {
                        var topcat = mapping_subcat_topcat[catList[xx]]
                        if (topcatList.indexOf(topcat) == -1) {
                            topcatList.push(topcat)
                        }
                    }
                }
            }


            tabs_info[current_tabId] = {
                domain: current_domain,
                topcatList: topcatList,
                url: current_url,
                trackers: []
            };


            var current_tab_hash = new String(current_url).hashCode();

            if ((current_tab_hash in per_url_policy) && per_url_policy[current_tab_hash] == 'conns_allow') {
                chrome.browserAction.setBadgeText({text:'N', tabId:current_tabId});
                chrome.browserAction.setBadgeBackgroundColor({color:'#008000' ,tabId:current_tabId})
            } else if (((current_tab_hash in per_url_policy) && per_url_policy[current_tab_hash] == 'conns_block') || intersect_safe(list_topcats_to_block_network_conns, topcatList).length > 0) {
                chrome.browserAction.setBadgeText({text:'B', tabId:current_tabId});
            } else {
                chrome.browserAction.setBadgeText({text:'N', tabId:current_tabId});
                chrome.browserAction.setBadgeBackgroundColor({color:'#008000' ,tabId:current_tabId})
            }

            //DB('tabs_info is', JSON.stringify(tabs_info))

        } else {
            if (!tabs_info[current_tabId])
                return;


            if (current_domain != tabs_info[current_tabId].domain) {

                if (!trackers_decision[current_domain]) {
                    trackers_decision[current_domain] = [tabs_info[current_tabId].domain]
                    chrome.storage.local.set({'trackers_decision': trackers_decision});
                } else {
                    if (trackers_decision[current_domain].indexOf(tabs_info[current_tabId].domain) == -1) {
                        trackers_decision[current_domain].push(tabs_info[current_tabId].domain);
                        chrome.storage.local.set({'trackers_decision': trackers_decision});
                    }
                }


                if (trackers_decision[current_domain].length > 2) {
                    if (current_domain != tabs_info[current_tabId].domain &&
                    (allowed_thirdparty_domains["all_domains"].indexOf(current_domain) == -1 ||

                    (allowed_thirdparty_domains[tabs_info[current_tabId].domain] &&
                    allowed_thirdparty_domains[tabs_info[current_tabId].domain].indexOf(current_domain) == -1)

                    )

                    ) {
                        if (tabs_info[current_tabId].trackers.indexOf(current_domain) == -1) {
                            tabs_info[current_tabId].trackers.push(current_domain)
                        }
                    }

                    var tab_url_hash = new String(tabs_info[current_tabId].url).hashCode();

                    if ((tab_url_hash in per_url_policy) && per_url_policy[tab_url_hash] == 'conns_allow') {
                        chrome.browserAction.setBadgeText({text:'N', tabId:current_tabId});
                        chrome.browserAction.setBadgeBackgroundColor({color:'#008000' ,tabId:current_tabId})
                        return;
                    } else if (((tab_url_hash in per_url_policy) && per_url_policy[tab_url_hash] == 'conns_block') || (intersect_safe(list_topcats_to_block_network_conns, tabs_info[current_tabId].topcatList).length > 0)) {

                        if (allowed_thirdparty_domains["all_domains"].indexOf(current_domain) > -1 ||
                        (allowed_thirdparty_domains[tabs_info[current_tabId].domain] &&
                        allowed_thirdparty_domains[tabs_info[current_tabId].domain].indexOf(current_domain) > -1)
                        ) {
                            return;
                        }

                        chrome.browserAction.setBadgeText({text:'B', tabId:current_tabId});
                        return {
                            cancel: true
                        };
                    } else {
                        chrome.browserAction.setBadgeText({text:'N', tabId:current_tabId});
                        chrome.browserAction.setBadgeBackgroundColor({color:'#008000' ,tabId:current_tabId})
                    }
                }
            }
        }
    }, {
        urls: ['http://*/*', 'https://*/*']
    }, ['blocking', 'requestHeaders']);





chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tabId == -1 || !tabs_info[tabId] || tab.incognito || stringStartsWith(tab.url,'file://') || stringStartsWith(tab.url,'chrome-extension://'))
        return;

    var tabStatus = changeInfo.status;
    //DB('changeInfo status is ', changeInfo.status)

    if (tabStatus == 'complete') {
        //DB('tab.url is', tab.url);

        var topcatList = tabs_info[tabId].topcatList

        var current_tab_hash = new String(tabs_info[tabId].url).hashCode();

        if ((current_tab_hash in per_url_policy) && per_url_policy[current_tab_hash] == 'conns_allow') {
            chrome.browserAction.setBadgeText({text:'N', tabId:tabId});
            chrome.browserAction.setBadgeBackgroundColor({color:'#008000' ,tabId:tabId})
        } else if (((current_tab_hash in per_url_policy) && per_url_policy[current_tab_hash] == 'conns_block') || intersect_safe(list_topcats_to_block_network_conns, topcatList).length > 0) {
            chrome.browserAction.setBadgeText({text:'B', tabId:tabId});
        } else {
            chrome.browserAction.setBadgeText({text:'N', tabId:tabId});
            chrome.browserAction.setBadgeBackgroundColor({color:'#008000' ,tabId:tabId})
        }

        var list_of_iframes_src = [];
        counter_for_received_response[tabId] = 0;

        function doCollectiFramesSrc(info) {
            //info[0] : doc url
            //info[1] : frameid
            counter_for_received_response[tabId]++;
            if (info && info.length == 2) {
                // if the domain is same as the main_frame url domain...ignore it!
                var iframe_domain = parseURL.parse(info[0]).domain;
                if (tabs_info[tabId] && iframe_domain != tabs_info[tabId].domain) {
                    list_of_iframes_src.push(info[0])
                }
                //DB('received from content script: ', tabId, info[0], info[1])
            }

            if (counter_for_received_response[tabId] == counter_for_iframe_response_tracking[tabId]) {
                // put everything in a object and add it to user_profile_to_upload
                var urlhash = new String(tabs_info[tabId].url).hashCode();
                //DB('url is', tabs_info[tabId].url, 'and urlhash is', urlhash);
                var info_page = {url: urlhash, topcatlist: tabs_info[tabId].topcatList, iframes_src:list_of_iframes_src, trackers: tabs_info[tabId].trackers,  ts: Date.now()};
                user_profile_to_upload.push(info_page)
            }
        }

        // Here, send a message to the content scripts included in all iFrames...
        chrome.webNavigation.getAllFrames({
            tabId: tabId
        }, function(details) {
            counter_for_iframe_response_tracking[tabId] = 0
            details.forEach(function(frame) {
                counter_for_iframe_response_tracking[tabId]++;
                //DB('frameId is', frame.frameId, 'and tabid is', tabId);
                chrome.tabs.sendMessage(
                    tabId, {
                        text: 'iframes_src_detection',
                        frameId: frame.frameId
                    }, {
                        frameId: frame.frameId
                    },
                    doCollectiFramesSrc
                );
            });
        });

    }

});



chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    if (!tabs_info[tabId])
        return;

    delete tabs_info[tabId];
});
