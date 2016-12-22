'use strict';
/*jslint node: true */

require('app-module-path').addPath(process.env.PWD + '/lib/js');

var winston = require('winston');
var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            'timestamp': true
        })
    ]
});

logger.info('CreateDevice: Trying to create device in IOT hub and getting key');

var config = require("configger");
var iothub = require('azure-iothub');

if (!config.get('IOTHUB_CONNSTRING')) {
    logger.error('CreateDevice: Unable to read connection string from config');
    process.exit(1);
} else {
    var connectionString = config.get('IOTHUB_CONNSTRING');
}


var registry = iothub.Registry.fromConnectionString(connectionString);

if (!config.get('DeviceID')) {
    logger.error('CreateDevice: Unable to read deviceID from config');
    process.exit(1);
} else {
    var device = {
        deviceId: config.get('DeviceID')
    };
}

logger.info('CreateDevice: Connecting to iot hub');

registry.create(device, function(err, deviceInfo, res) {
    if (err) {
        registry.get(device.deviceId, printDeviceInfo);
    }
    if (deviceInfo) {
        printDeviceInfo(err, deviceInfo, res);
    }
});

function printDeviceInfo(err, deviceInfo, res) {
    if (deviceInfo) {
        logger.info('CreateDevice: DeviceID=', deviceInfo.deviceId);
        logger.info('CreateDevice: PrimaryKey=', deviceInfo.authentication.symmetricKey.primaryKey);
    }
}
