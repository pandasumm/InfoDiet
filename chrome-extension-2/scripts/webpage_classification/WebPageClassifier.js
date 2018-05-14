/**
 * @File: WebPageClassifier.js
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

// Existing variables...
// domain_rules
// host_rules
// path_rules
// en_kws_catid_mapping
// en_fpkws_catid_mapping
// fr_kws_catid_mapping
// es_kws_catid_mapping
// it_kws_catid_mapping

function WebPageClassifier() {
    var components = {};
    var catObt = -1;
    //DB(Object.keys(fr_kws_catid_mapping));
    //DB('fr_kws_catid_mapping["actualité"] = ',fr_kws_catid_mapping["actualité"]);

    function classifyBasedOnUrlLists(url) {
        
        components = parseURL.parse(url);
        var domain = components.domain;
        
        function checkTree(levels, tree) {
            //Recursively checks a tree similar to the one made above in make_tree()
            if (levels.length == 1) {
                if (tree.hasOwnProperty(levels[0])) {
                    return tree[levels[0]]
                }
                return false
            } else {
                if (tree.hasOwnProperty(levels[0])) {
                    return checkTree(levels.slice(1, levels.length), tree[levels[0]])
                } else {
                    return false
                }
            }
        }

        //check if it is a single topic site
        if (domain_rules.hasOwnProperty(domain)) {
            catObt = domain_rules[domain]
            return catObt
        }

        //check if it is a single topic host
        var predomain = components.predomain
        if (predomain.length > 0) {
            if (host_rules.hasOwnProperty(domain)) {
                var catObt = checkTree(predomain.split('.'), host_rules[domain])
                if (catObt) {
                    return catObt
                }
            }
        }

        //check if it is a single topic path
        var path = components.pathname;
        //DB('path is', path)
        if (path_rules.hasOwnProperty(domain)) {
            if (path.length > 0) {
                var first_chunk = path.split('/')[1]
                //DB('first chunck is', first_chunk)
                if (path_rules[domain].hasOwnProperty(first_chunk)) { //note that this currently only checks
                    //DB('it is found in the path_rules')
                    catObt = path_rules[domain][first_chunk] //1 level of path i.e. these are the same domain.com/tech and domain.com/tech/apple
                    return catObt
                }
            }
        }

        return -1;
    }

    this.classify_basedOnUrlList = function(url) {
        catObt = -1
        components = {}
        
        catObt = classifyBasedOnUrlLists(url)
        
        //DB('category obtained after looking only in url list is', catObt, ', the category is', mapping_code_subcat[catObt])
        
        return [catObt];
    }

    this.classify = function(obj) {
        catObt = -1;
        components = {};
        
        var url = obj.url;
        var title = obj.title;
        var kws = obj.kws;
        var content = obj.content;

        //DB('In classify function');
        //DB('url is', url)
        //DB('title is', title)
        //DB('kws is', kws)
        //DB('content is', content)

        components = parseURL.parse(url);
        var domain = components.domain;


        function processString(str) {
            // put into lower case
            str = str.toLowerCase();

            // break into words using our regex..
            var str_words = str.match(/[a-z|0-9|\u00E0-\u00F6|\u00F8-\u00FF]{2,}/gi)

            if (!str_words)
                return [-1]
            // make bigrams 
            bigrams = [];
            var lastWord = str_words[0];
            for (var i = 1; i < str_words.length; i++) {
                bigrams.push(lastWord + str_words[i]);
                lastWord = str_words[i]
            }

            var str_words = str_words.concat(bigrams);

            return str_words;
        }

        function buildCatHisto(weight, words, histo, dict, lang_wt) {
            var wordsAppeared = [];
            for (var i = 0; i < words.length; i++) {

                if (resultWord = dict[words[i]]) {

                    wordsAppeared.push(words[i])

                    var len = resultWord.length
                    var freqWord = resultWord[len - 1]

                    for (var j = 0; j < len - 1; j++) {
                        histo[resultWord[j]] += (lang_wt * weight) / freqWord
                        //DB('word found in dict is', words[i], 'its category is', resultWord[j])
                    }
                }
            }
            for (var i = 0; i < wordsAppeared.length; i++) {
                var index = words.indexOf(wordsAppeared[i]);
                if (index > -1) {
                    //DB('yes, word found. removing it.');
                    words.splice(index, 1);
                }
            }
                    
        }




        var good_predomain
        var splitted_predomain = components.predomain.split('www')
        if (splitted_predomain.length == 1)
            good_predomain = splitted_predomain[0]
        else
            good_predomain = splitted_predomain[1]

        url = good_predomain + ' ' + components.domain + ' ' + components.pathname + ' ' + components.hash + ' ' + components.search

        var url_words, title_words, kws_words, content_words;
        if (url && url != '')
            url_words = processString(url)
        if (title && title != '')
            title_words = processString(title)
        if (kws && kws != '')
            kws_words = processString(kws)
        if (content && content != '')
            content_words = processString(content)


        //DB('url words are', url_words)
        //DB('title words are', title_words)
        //DB('kws words are', kws_words)
        //DB('content words are', content_words)


        var tld = components.tld
        //DB('tld is', tld)

        var lang = 'en';
        if (tld != 'fr' && tld != 'es' && tld != 'it') {
            //DB('tld is not fr or es or it...')
            var words_to_check = 0;
            if (content_words[0] == -1) {
                words_to_check = 0
            } else if (content_words.length < 1000) {
                words_to_check = content_words.length
            } else {
                words_to_check = 1000
            }
            //DB('words_to_check are', words_to_check)
            var en_counter = 0;
            var fr_counter = 0;
            var es_counter = 0;
            var it_counter = 0;
            for (var i = 0; i < words_to_check; i++) {
                if (en_stopwords[content_words[i]]) {
                    en_counter += 1;
                } else if (fr_stopwords[content_words[i]]) {
                    fr_counter += 1;
                } else if (it_stopwords[content_words[i]]) {
                    it_counter += 1;
                } else if (es_stopwords[content_words[i]]) {
                    es_counter += 1;
                }

            }
            //DB('en_counter:', en_counter, 'es_counter:', es_counter, 'fr_counter', fr_counter, 'it_counter', it_counter)

            var max = Math.max(en_counter, es_counter, fr_counter, it_counter)
            //DB('max is', max)
            if (max == es_counter)
                lang = 'es'
            else if (max == it_counter)
                lang = 'it'
            else if (max == fr_counter)
                lang = 'fr'
                
            if (words_to_check == 0) {
                lang = 'en';
            }

            //DB('finally, lang is', lang)

        }





        var cat_histo = Array.apply(null, Array(NO_SUB_CATS)).map(Number.prototype.valueOf, 0);

        function call_buildHisto(wt_type, word_type) {
            //DB('in the beginning, word_type is', word_type)
            if (tld == 'fr' || lang == 'fr')
                buildCatHisto(wt_type, word_type, cat_histo, fr_kws_catid_mapping, WT_FR)
            else if (tld == 'es' || lang == 'es')
                buildCatHisto(wt_type, word_type, cat_histo, es_kws_catid_mapping, WT_ES)
            else if (tld == 'it' || lang == 'it')
                buildCatHisto(wt_type, word_type, cat_histo, it_kws_catid_mapping, WT_IT)
            else
                buildCatHisto(wt_type, word_type, cat_histo, en_kws_catid_mapping, WT_EN)

            //DB('in the mid, word_type is', word_type)

            buildCatHisto(wt_type, word_type, cat_histo, en_fpkws_catid_mapping, WT_FP_EN)
            //DB('in the end, word_type is', word_type)
        }

        if (url_words)
            call_buildHisto(WT_URL, url_words)
        //DB('after url, cat_histo is', cat_histo)

        if (title_words)
            call_buildHisto(WT_TITLE, title_words)
        //DB('after title, cat_histo is', cat_histo)

        if (kws_words)
            call_buildHisto(WT_KWS, kws_words)
        //DB('after kws, cat_histo is', cat_histo)

        if (content_words)
            call_buildHisto(WT_CONTENT, content_words)
        //DB('after content, cat_histo is', cat_histo)

        //DB('final cat_histo is', cat_histo)

        var max_value = getMaxOfArray(cat_histo)
        //DB('max_value is', max_value)

        if (max_value == 0){
            return [-1]
        }

        var sum = cat_histo.reduce(function(a, b) { return a + b; });
        var avg = sum / cat_histo.length;

        var alpha = .7

        var threshold = alpha * (max_value - avg)
        // check all values in the distrubtion which are greater than threshold
        var cats_above_bar = {};
        for (var ab = 0; ab < cat_histo.length; ab++) {
            if (cat_histo[ab] >= max_value - threshold) {
                cats_above_bar[ab] = cat_histo[ab]
            }
        }

        // now sort them and return top three in the order...
        // Create items array
        var items = Object.keys(cats_above_bar).map(function(key) {
            return [key, cats_above_bar[key]];
        });

        // Sort the array based on the second element
        items.sort(function(first, second) {
             return second[1] - first[1];
        });

        // Create a new array with only the first 5 items
        //DB(items.slice(0, 3));
        //# [ [ 'd', 17 ], [ 'c', 11 ], [ 'z', 9 ], [ 'b', 7 ], [ 'y', 6 ] ]



        DB('JSON.stringify(cats_above_bar) is', JSON.stringify(cats_above_bar))

        //var catObt = cat_histo.indexOf(max_value);
        //DB('catId is', catObt, 'the category is', mapping_code_subcat[catObt])

        //return catObt;

        if (items.length == 0) {
            return [-1]
        } else if (items.length == 1) {
            return [items[0][0]];
        } else if (items.length == 2) {
            return [items[0][0], items[1][0]];
        } else {
            return [items[0][0], items[1][0], items[2][0]]; 
        } 
    }


    return this;
}
