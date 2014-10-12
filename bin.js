#!/usr/bin/env node

var path = require('path');
var spawn = require('child_process').spawn;

var pkg = require( path.join(__dirname, 'package.json') );

// Parse command line options
var program = require('commander');

program
    .version(pkg.version)

    .option('--frontport <port>',
        'Port on which frontend listens to (defaults to 9000)', parseInt)
    .option('--fronthost <hostname>',
        'Hostname on which frontend listens to (defaults to localhost)')
    .option('--frontonly',
        'Run frontend only', parseInt)

    .option('--backport <port>',
        'Port on which backend listens to (defaults to 8080)', parseInt)
    .option('--backhost <hostname>',
        'Hostname on which backend listens to (defaults to localhost)')
    .option('--backonly',
        'Run backend only', parseInt)

    .parse(process.argv)
;

var frontport = program.frontport || 9000;
var fronthost = program.fronthost || "localhost";
var frontonly = program.frontonly || false;
var backport = program.backport || 8080;
var backhost = program.backhost || "localhost";
var backonly = program.backonly || false;

var front_process;
if( ! backonly ){
    front_process =  spawn(process.execPath, [
        path.join(__dirname, 'frontend.js'),
        '-h', fronthost,
        '-p', frontport]);
    front_process.stdout.on('data', function (data) {
        console.log(data.toString().trim());
    });
    front_process.stderr.on('data', function (data) {
        console.error(data.toString().trim());
    });
    front_process.on('exit', function (code) {
        console.log('child process exited with code ' + code);
    });
}

var back_process;
if( ! frontonly ){
    back_process =  spawn(process.execPath, [
        path.join(__dirname, 'backend.js'),
        '-h', backhost,
        '-p', backport]);
    back_process.stdout.on('data', function (data) {
        console.log(data.toString().trim());
    });
    back_process.stderr.on('data', function (data) {
        console.error(data.toString().trim());
    });
    back_process.on('exit', function (code) {
        console.log('child process exited with code ' + code);
    });
}

readline_toquit(function(){
    if( back_process ) back_process.kill();
    if( front_process ) front_process.kill();
    process.exit(code=0);
});

function readline_toquit( end_handler ){

    var readline = require('readline');
    var rl = readline.createInterface(process.stdin, process.stdout);

    rl.question('Press enter to leave...\n', function(answer) {
        rl.close();
        if( end_handler != null ){
            end_handler();
        }
    });
}

