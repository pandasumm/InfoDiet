/**
 * @File: ParseURL.js
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


function ParseURL() {

    /**
     * Parses the url for different elements.
     * @param  {string} url A website’s absolute URL.
     * @return {Object}     A dictionary containing various elements.
     */

    /**
    Based on:
    var parser = document.createElement('a');
     parser.href = "http://www.sport.example.com:3000/pathname/?search=test#hash";

     parser.protocol; // => "http:"
     parser.host;     // => "www.sport.example.com:3000"
     parser.hostname; // => "www.sport.example.com"
     parser.port;     // => "3000"
     parser.pathname; // => "/pathname/"
     parser.hash;     // => "#hash"
     parser.search;   // => "?search=test"
     
     parser.tld;      // => "com"
     parser.domain;   // => "example.com"
     parser.predomain;// => "www.sport"
    */
    
    //DB('tlds are',JSON.stringify(tlds))
    
    this.parse = function(url) {
        var anchor = document.createElement('a');
        anchor.href = url;

        var labels = anchor.hostname.split('.');
        var labelCount = labels.length - 1;

        var result = {
            protocol: anchor.protocol,
            host: anchor.host,
            hostname: anchor.hostname,
            port: anchor.port,
            pathname: anchor.pathname,
            hash: anchor.hash,
            search: anchor.search
        };

        result.domain = "";
        result.tld = "";
        result.predomain = "";

        // IP addresses shouldn’t be munged.
        if (isNaN(parseFloat(labels[labelCount]))) {
            result.domain = labels.slice(-2).join('.');
            result.tld = labels[labelCount];
            result.predomain = labels.slice(0, labelCount - 1).join('.')
            var tld = ''
            for (var i = labelCount; i > 1; i--) {
                tld = labels.slice(-i).join('.');
                if (tlds[tld]) {
                    result.tld = tld;
                    result.domain = labels.slice(-i - 1).join('.');
                    result.predomain = labels.slice(0, labelCount - i).join('.')
                }
            }
        }

        return result;
    };

    return this;
}