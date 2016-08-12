/*
 * aarg hope this will work
 */
var postAction = function postAction(actionObject, callback) {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) { 
            callback(xhttp.responseText);
        }
    };

    xhttp.open("POST", "http://localhost:8001/", true); 
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(actionObject));
};
 
var ws = null;
var ChromeSocketsTcp = {

    create: function (success, error, options) {
        
       

        console.log("create called");
        console.log(JSON.stringify(options));
        postAction({ action: "create" }, function (res){
            return success(res);
        });

            // start proxy ws-socket
            // connect to proxy
            //var socketInfo = { "socketId": "bliebla" };
            // nextline doesn't seem to work???
    //        return success(socketInfo); //run callback


    },

    connect: function (success, error, options) {
        console.log("connect called");
        console.log(JSON.stringify(options));
        return success();
    },

    write: function () {
        console.log("write called");
    },

    read: function () {
        console.log("read called");
    }
};

module.exports = ChromeSocketsTcp;
require('cordova/exec/proxy').add('ChromeSocketsTcp', ChromeSocketsTcp);
