'use strict';
/*jslint node: true */

// Defining logger
var winston = require('winston');
var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            'timestamp': true
        })
    ]
});

var PythonShell = require('python-shell');

function readSensors(callback) {
    var sRead = new PythonShell('./lib/py/sread.py');

    logger.info('sensorworker: Prepare to read enironmental sensors');
    sRead.on('message', function(message) {
        logger.info('sensorworker: Sending sensor data', message);
        callback(message);
    });

}

exports.readSensors = readSensors;
