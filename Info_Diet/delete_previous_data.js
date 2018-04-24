var DB_FLAG = false;
var HOST='https://myrealonlinechoices.inrialpes.fr/'

function DB() {
    if (DB_FLAG == false)
        return;
    var str = '';
    for (var i = 0; i < arguments.length; i++)
        str += arguments[i] + ' ';
    console.log(str);
}

function submit_data(uid) {
    DB('In submit_data()');
    // Here we would have to make a copy of it...and then, re-initialize it...need to check.
    var main_data = JSON.stringify({uid:uid});
    DB('data which is going to be sent in the upload request: ', main_data)

    var xhr = new XMLHttpRequest();
    xhr.open('POST', HOST+'/cgi-bin/delete_mytrackingchoices.py', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                DB('Data deleted!');
                DB('xhr.responseText is',xhr.responseText)
                alert('Your data previously uploaded, if any, has been deleted from our database.');
            }
            else
                DB('retry to send the data...')
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(main_data);
}


window.onload = function() {
	chrome.storage.local.get(['uid'], function(result){
      submit_data(result.uid);
      DB('result.uid is', result.uid)
      });
 // return false;
}
