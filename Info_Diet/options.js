/**
 * @File: options.js
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




function display_cats_option_table() {
    // get the table div
    var div_element = document.getElementById("table_div");

    // now add the table to this div_element..
    var table = document.createElement('table');

    var tr = document.createElement('tr');

    var text1 = document.createTextNode('Category');
    var text2 = document.createTextNode('BlockTrackers');

    var th1 = document.createElement('th');
    th1.style.textAlign = "center";

    var th2 = document.createElement('th');
    th2.style.width = "100px";
    th2.style.textAlign = "center";

    th1.appendChild(text1);
    th2.appendChild(text2);

    tr.appendChild(th1);
    tr.appendChild(th2);

    table.appendChild(tr);


    var top_cat_list = Object.keys(mapping_topcat_code);

    for (var i = 0; i < top_cat_list.length; i++){
        var tr = document.createElement('tr');

        var text1 = document.createTextNode(top_cat_list[i]);

        var input_checkbox1 = document.createElement("INPUT");
        input_checkbox1.setAttribute("type", "checkbox");
        input_checkbox1.className = "block_network_conns";
        input_checkbox1.setAttribute("name",top_cat_list[i]);

        var th1 = document.createElement('td');
        th1.style.textAlign = "center";

        var th2 = document.createElement('td');
        th2.align = "center";

        th1.appendChild(text1);
        th2.appendChild(input_checkbox1);

        tr.appendChild(th1);
        tr.appendChild(th2);

        table.appendChild(tr);
    }

    while (div_element.firstChild) {
        div_element.removeChild(div_element.firstChild);
    }
    div_element.appendChild(table);
}


display_cats_option_table();




window.onload = function () {
    var input_network = document.querySelectorAll('input.block_network_conns');
    var background = chrome.extension.getBackgroundPage();

    function check_network() {
        var j;
        new_topcat_list_to_block_network_conns = []
        for (j = 0; j < input_network.length; j++) {
            if (input_network[j].checked) {
                new_topcat_list_to_block_network_conns.push(j);
            }
        }
        chrome.storage.local.set({'list_topcats_to_block_network_conns':new_topcat_list_to_block_network_conns});
    }

    var list_topcats_to_block_network_conns = background.list_topcats_to_block_network_conns;

    for (var i = 0; i < input_network.length; i++) {
        input_network[i].onchange = check_network;
        if (list_topcats_to_block_network_conns.indexOf(i) > -1) {
            input_network[i].checked = true;
        }
    }

}
