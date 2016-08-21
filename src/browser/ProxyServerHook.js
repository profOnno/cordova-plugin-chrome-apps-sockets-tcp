#!/usr/bin/env node

/*
 * for development run
 * './runproxy.js'
 */

module.exports = function (context) {
    //var http  = require('http');
    var express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        server = require('http').createServer(),
        randid = require('random-strings'),
        Socket = require('net').Socket,
        websocket = require('websocket-stream'),
        DuplexStream = require('stream').Duplex,
        wsSockets = {}, //holds websockets to frontend
        tcpSockets = {}, //holds tcp sockets to backend 
        cnt = 0;

    //CORS middleware
    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*'); //localhost???
        res.header('Access-Control-Allow-Methods', 'GET,POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        next();
    };

    console.log("starting ProxyServerHook");

    // intermediate websocket test 
    // var iWss = new ws({ port: 8066 }); //this works
    // var iWss = websocket.createServer({ port: 8066 }); //this also works
   /* 
    var iWss = websocket.createServer({ server: server }); 
    
    iWss.on('connection', function (iws) {
        iws.on('message', function (msg) {
            console.log('msg:',msg);
        });
        iws.on('message', function (msg) {
            console.log('msg:',msg);
        });
    });

    iWss.on('error', function (error) {
        console.log("iwss error:",JSON.stringify(error));
    });
    */
    // END intermediate websocket test 

    app.use(allowCrossDomain);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    /*app.get('/', function(req, res) {
        //res.writeHead(200,{"Content-Type": "text/html"});
       res.sendFile(__dirname + '/www/index.html');
    });
*/
    app.use(express.static(__dirname + "/www"));

    app.post('/', function (req,res) {
 //       console.log('got post action');
  //      console.log(JSON.stringify(req.body, null, 2));
        
        //dosomething
        
        res.setHeader('Content-Type', 'application/json');

        switch (req.body.action) {
            case "create":
                (function () {
//                    console.log("create request");
                    // TODO try block..
                    var sid = randid.alphaNumMixed(16);
 //                   console.log("sid:", sid);
                    
                    var client = new Socket();

                    tcpSockets[sid] = client;
    /*                
                    app.sockets[sid].connect({port: 3000, host: "192.168.1.101"}, function () {
                        console.log("connected");
                        app.sockets[sid].write("hellejjjj lujaaaa");
                    });
                    */
                    
                    
                    // rewrite object to chrome api spec
                    var result = { 
                            result: "ok",
                            data: {
                                socketId : sid 
                            }
                    };

                    res.write(JSON.stringify(result));
                    res.end();
                }());
                break;
            
            case "connect":
                (function () {
   //                 console.log("connect");
    //                console.log("req.body:");

                    var sRef = req.body.data[0],
                        ip = req.body.data[1],
                        port = req.body.data[2];

                    var client = tcpSockets[sRef];

     //               console.log("sRef: %s, ip: %s, port: %s", sRef, ip, port);
                    
                    client.connect({ host: ip, port: port }, function () {
      //                  console.log("connected"); 
                        // now make a new websocket and bind it to this client.
                        // websocket sever should not be started over here
                        // merge the async.. this connect request and the new incomming connection..
                        // so how do we do that
       //                 console.log("ws url should add sRef:",sRef); 
                        wsSockets[sRef] = websocket.createServer({ server: server, path: "/" + sRef }, function (stream) {
                            client.pipe(stream);
                            stream.pipe(client);
                            //hmm works only from tcp to webclient
                            //
                        });

                        //stream it 
                        /*
                        wsSockets[sRef].on('connection', function ( wsClient) {
                            console.log("got websocket connection");
                            wsClient.send("aarghihiehiaoij");
                            wsClient.on('message', function (msg) {
                                console.log('received:', msg);
                            });

                        });
                        */
                        /* for the stream stuff that doesn't work 
                        {
                            console.log("got stream data, trying to connect it");
                            stream.pipe(client); //hope this work
                        });
                        */
                        // TODO check if this async works... meanig result isn't send to early
                        // should be in the websocket.on 'connection'
                        var result = { result: "ok", data: 1 }; // data should be result code from underlying call... negative is error
                        res.write(JSON.stringify(result));
                        res.end();
                    });

                }());
                break;

            default:
                console.log("not implemented, or wrong request");
                res.write('{"result": "error"}');
        }

        
        //res.end(); // needed? not like this... some res.write are encapsulated in callbacks..
        
    });

    server.on('request', app);
    server.listen(8001, function () {
        console.log("Listening on port 8001...");
    });

};

