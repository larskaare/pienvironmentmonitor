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

var config = require("configger");
var PythonShell = require('python-shell');

function readSensors(callback) {
    var mockPi = config.get('MockPi') || false;
    // logger.info('sensorworker: mockpi ', mockPi);

    if (mockPi === true) {
        var rnd = require('random-js')();
        var sData = new sensorData();
        var message;

        sData.temperature = rnd.real(17, 32).toFixed(3);
        sData.barometicPressure = rnd.real(800, 1050).toFixed(6);
        sData.humidityP = rnd.real(35, 80).toFixed(2);
        sData.lux = rnd.real(0.1, 2000).toFixed(2);

        message = JSON.stringify(sData);
        logger.info('sensorworker: Generating sensor data', message);
        callback(message);

    } else {

        var sRead = new PythonShell('./lib/py/sread.py');

        logger.info('sensorworker: Prepare to read enironmental sensors');
        sRead.on('message', function (message) {
            logger.info('sensorworker: Sending sensor data', message);
            callback(message);
        });

    }

}

exports.readSensors = readSensors;

function sensorData(temperature, barometicPressure, humidityP, lux) {
    /*jshint validthis:true */
    this.temperature = temperature;
    this.barometicPressure = barometicPressure;
    this.humidityP = humidityP;
    this.lux = lux;
}