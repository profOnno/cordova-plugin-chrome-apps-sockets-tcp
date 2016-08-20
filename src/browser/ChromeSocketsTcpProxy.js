/*
 * aarg hope this will work
 */
var postAction = function postAction(actionObject, callback) {

    var xhttp = new XMLHttpRequest(),
        data = JSON.stringify(actionObject);

    console.log("proxy>");
    console.log(data);

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) { 
            callback(xhttp.responseText);
        }
    };

    xhttp.open("POST", "http://localhost:8001/", true); 
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);
};

var log = function () {
    // should do something with the args
    // so "bla: %s, %s", x, y works
    var prefix = "PROXY> ";

    var myAr = Array.prototype.slice.call(arguments);
    myAr[0] = prefix + myAr[0];
    //doesn't have the stack... line number...
    console.log.apply(console, myAr);
};

var ws = {},
    listenerObj = {},
    eventListeners = [],
    successHandler, errorHandler;
  //  menno = onReceive; //onReceive not defined is exported from www to frontend?

var ChromeSocketsTcp = {
    readyToRead: function (win, fail, args, env) {
        console.log("PROXY: hmmm data?");
    },
   
    create: function (success, error, options) {

        log("create called");
        log(JSON.stringify(options));
        postAction({ action: "create" }, function (res) {
            log(res);
            res = JSON.parse(res);
            log(res);
            if (res.result === "ok") {
                log("res.result === \"ok\"");
                log("aarg:");
                log(JSON.stringify(res.data));
                success(res.data.socketId); // TODO is weird... cause data should be the object already
            } else {
                error(res.result);
            }
        });

            // start proxy ws-socket
            // connect to proxy
            //var socketInfo = { "socketId": "bliebla" };
            // nextline doesn't seem to work???
    //        return success(socketInfo); //run callback


    },

    registerReceiveEvents: function(success, error, options) {
        /*
        console.log("CSTP: registerReceiveEvents");
        
        console.log(arguments[0].toString()); //onSuccess
        console.log(arguments[1]); //onError
        console.log(arguments[2]); //array arguments...
        //should be an id??
        */
        

        // function is correct... but the options???
        // like set keepCallback...
        successHandler = function (data) {
            var callbackOptions = { 
        //            callbackId: "menno", 
                    keepCallback: true
                };
            success(data, callbackOptions) ;
        };
        errorHandler = error;
       
/*        window.addEventListener('onReceive', function () {
            success("hello");
        }, false);
        */
        
        //
        // asumes readyToRead on backend
        // win = function(info, data) ...
        // seems to be the callback
        // 2nd argument = [];//filled when listener added?
        // android has socketId there
        // is called on startup...
        // 
        // in test this is called... so do we in the index.html 
        // chrome.sockets.tcp.onReceiveError.addListener(receiveErrorListener);
        // chrome.sockets.tcp.onReceive.addListener(receiveListener);

        /*
        listenerObj.addEventListener('receive');
        listenerObj.addEventListener('receiveError');
        eventListeners.push(obj);
        */
        return ""; //cordova.js:910
    },

/*    readyToRead: function () {
        console.log("CSTP readyToRead");
        console.log(arguments[0]);
        console.log(arguments[1]);
    },

    */
    onReceive: function () {
        console.log("onReceive triggerd");
        console.log(JSON.stringify(arguments));
    },

    connect: function (success, error, options) {
        log("connect called");
        log(JSON.stringify(options));

        //var socketId = options.data[0];
        // don't know why options has socketId in object???
        postAction({ action: "connect", data: options  }, function (res) {
            log("back from postAction connect");
            log(res); 
            res = JSON.parse(res);

            if (res.result === "ok") {
                // make a websocket
                log("socketId:", socketId);
                var myws = ws[socketId] = new WebSocket("ws://127.0.0.1:8001/"+socketId); // the ws port and host, not the tcp endpoint

                myws.binaryType = 'arraybuffer';
                myws.onclose = function (evt) {
                    // https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
                    log("websocket close event code:", evt.code);
                };
                myws.onmessage = function (evt) {
                    log("got websocket message, got to relay");
                    log(evt.data);
                    // web js... uses dispatchEvent??

                    // this will throw a TypeError;
                    // cordova.js:290 expects the callback (successHandler) to be in the callbacks object
                    // cordova.js:934 should register the callback
                    // it is not registered there... so huh...
                    // maybe buffer data here... call a existing event trigger...
                    try {
                        //now only called once... seems.. to invoke the send response instead of or own one
                        setTimeout(function () {
                            successHandler(evt.data); //1 should be SOCKET IDDD TODO
                        },100);
                    } catch (e) {
                        //console.log("type error");
                    }
                   //this calls the function in the event handler...
                   //but it should return something??


                    //console.log(JSON.stringify(ChromeSocketsTcp.onReceive));
                    //var onReceive = new Event('onReceive');

                    //window.dispatchEvent('onReceive', evt.data);
                };
                myws.onopen = function () {
                    //myws.send("hello you there...");
                    log("websocket open...");
                    //myws.send(new Uint8Array([0x10, 0x02, 0x31, 0x7e, 0x94, 0x10, 0x03]));
                    
                    ws[socketId] = myws; // add to sockets object
                    
                    return success(1); // TODO get the right result codes, result code negative is error... pos is ok
                };
            } else {
                return error(-1);
            }
        });
    },

    send: function (success, error, options) {
        log("send called");
        console.log(options); // should be array with socketId and data;
        var socketId = options[0];

        ws[socketId].send(options[1]);
        /*
        console.log(arguments);
        console.log(options); // should be array with socketId and data;
        console.log(options[1]); // should be array with socketId and data;
        options[1] = b64.fromByteArray(new Uint8Array(options[1]));
        console.log(options[1]); // should be array with socketId and data;
        postAction( { action: "send", data: options }, function (res) {
            // whatdafuck is bytesSent
            // seems to be a resultCode: 0 
            // parse res
            res = JSON.parse(res);
            if (res.result === "ok") {
                var retVal = res.cnt;
            } else {
                error(res.result);
            }
            return success(res); 
        });
        */
        // bytes send??
        return success(10); //TODO whats the return value

}

/*
    read: function () {
        log("read called");
    }
    */
};

module.exports = ChromeSocketsTcp;
require('cordova/exec/proxy').add('ChromeSocketsTcp', ChromeSocketsTcp);
