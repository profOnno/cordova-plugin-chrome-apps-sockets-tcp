var exec = require('child_process').execFile;

console.log("installing dependencies...");
execFile('npm',['install']);
