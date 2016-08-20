var Socket = require('net').Socket;

var client = new Socket();

client.connect({ host: "192.168.1.101", port: 3000}, function(){
    console.log("connected");
    client.write("aargh");
});

