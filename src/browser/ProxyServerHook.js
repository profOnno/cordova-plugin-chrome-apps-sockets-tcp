#!/usr/bin/env node

/*
 * for development run
 * './runproxy.js'
 */

module.exports = function (context) {
    //var http  = require('http');
    var express = require('express'),
        bodyParser = require('body-parser'),
        app = express();

    //CORS middleware
    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*'); //localhost???
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        next();
    };

    console.log("starting ProxyServerHook");

    app.use(allowCrossDomain);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get('/', function(req, res) {
        //res.writeHead(200,{"Content-Type": "text/html"});
/*        var msg = "You should not be sending an html request...<br>try something like this:<br><br>";
            msg += "<code>curl -H \"Content-Type: application/json\" -X POST -d '{\"action\": \"create\"}' http://localhost:8001</code>";
            */
        var msg = '<!DOCTYPE html>\n';
            msg += '<html>\n';
        msg += '<body>\n';

        msg += '<h2>AJAX</h2>\n';

        msg += '<button type="button" onclick="postit()">postit</button>\n';

        msg += '<p id="demo"></p>\n';
         
        msg += '<script>\n';
        msg += 'function postit() {\n';
              msg += 'var xhttp = new XMLHttpRequest();\n';
                msg += 'xhttp.onreadystatechange = function() {\n';
                        msg += 'if (xhttp.readyState == 4 && xhttp.status == 200) {\n';
                                  msg += 'document.getElementById("demo").innerHTML = xhttp.responseText;\n';
                                msg += '  }\n';
              msg += '};\n';
             msg += ' xhttp.open("POST", "http://localhost:8001/", true);\n'; // TODO add cors for 127.0.0.1?
              msg += 'xhttp.setRequestHeader("Content-type", "application/json");\n';
              msg += 'xhttp.send(JSON.stringify({ action: "create" }));\n';
        msg += '}\n';
        msg += '</script>\n';
        msg += '</body>\n';
        msg += '</html>\n';
        res.send(msg);
    });

    app.post('/', function (req,res) {
        console.log('got post action');
        console.log(JSON.stringify(req.body, null, 2));
        
        //dosomething
        
        res.setHeader('Content-Type', 'application/json');

        switch (req.body.action) {
            case "create":
                console.log("create request");
                res.write('{"result": "ok"}');
                break;
            
            case "connect":
                console.log("create request");
                console.log("connecting to ip: %s", req.body.ip);
                console.log("connecting to port: %s", req.body.port);
                res.write('{"result": "ok"}');
                break;

            default:
                console.log("not implemented, or wrong request");
                res.write('{"result": "error"}');
        }

        
        res.end();
        
    });

    app.listen(8001, function () {
        console.log("Listening on port 8001...");
    });

//    console.log(JSON.stringify(context));
};

