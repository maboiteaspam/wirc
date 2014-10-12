'use strict';

var express = require('express');

var path = require('path');
// Parse command line options
var program = require('commander');
var pkg = require( path.join(__dirname, 'package.json') );

program
    .version(pkg.version)

    .option('-p, --port <port>',
    'Port on which listens to (defaults to 9000)', parseInt)
    .option('-h, --hostname <hostname>',
    'Hostname on which listens to (defaults to localhost)')

    .parse(process.argv)
;

var frontend = function(host,port){

    host = host || "localhost";
    port = port || 9000;

    var app = express();

    app.use( '/bower_components',
        express.static(__dirname + '/bower_components'));
    app.use(express.static(__dirname + '/app'));

    app.listen(port, host, function() {
        console.log('Listening on '+host+":"+port);
    });
};
frontend(
    program.hostname || "localhost",
    program.port || 9000
);
