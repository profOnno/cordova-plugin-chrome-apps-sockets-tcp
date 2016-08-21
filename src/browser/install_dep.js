var execFile = require('child_process').execFile,
    exec = require('child_process').exec,
    spawn = require('child_process').spawn;

console.log("installing dependencies...");

execFile('node',['-v'], function (error, stdout, stderr) {
    if (error) {
        throw error;
    }
    console.log(stdout);
});

execFile('pwd', function (error, stdout, stderr) {
    if (error) {
        throw error;
    }
    console.log(stdout);
});
/*
execFile('npm', ['install'], { cwd: "plugins/cordova-plugin-chrome-apps-sockets-tcp/src/browser" }, function (error, stdout, stderr) {
    if (error) {
        throw error;
    }
    console.log(stdout);
});
*/

// assuming the current directory is the root of your cordova app
var npm = spawn('npm', ['install'], { cwd: "plugins/cordova-plugin-chrome-apps-sockets-tcp/src/browser" });
//var npm = spawn('npm', ['install']);
npm.stdout.pipe(process.stdout);
npm.stderr.pipe(process.stderr);

npm.on('close', function (code) {
    console.log("done: ", code);
});


