'use strict';
/*jslint node: true */

require('app-module-path').addPath(process.env.PWD + '/lib/js');

var config = require("configger");

var winston = require('winston');
var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            'timestamp': true
        })
    ]
});

var sensors = require('sensorworker');


function getSensorData() {
    sensors.readSensors(function(data) {
        logger.info('Moni: getting sensor data', data);
    });
}

getSensorData();
