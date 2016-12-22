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

var config = require("configger");

var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
var Message = require('azure-iot-device').Message;


if (config.get('HUB_HOSTNAME') && config.get('DeviceID') && config.get('DEVICE_KEY')) {
    var connectionString = "HostName=" + config.get('HUB_HOSTNAME') + ";DeviceId=" +
        config.get('DeviceID') + ";SharedAccessKey=" + config.get('DEVICE_KEY');
} else {
    logger.error('HubWorker: Unable to build device connection string - no reason to live');
    process.exit(1);
}


logger.info('HubWorker: Connecting to IOT hub');
var client = clientFromConnectionString(connectionString);

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) {
            logger.error('HubWorker: ' + ' error: ' + err.toString());
        }
        if (res) {
            logger.info('HubWorker: ' + ' status: ' + res.constructor.name);
        }
    };
}

var connectCallback = function(err) {
    if (err) {
        logger.error('HubWorker: Could not connect', err);
    } else {
        logger.info('HubWorker: Connected to IOT Hub');
    }
};

//Function to trigger connection to IOT Hub
function connectClient() {
    client.open(connectCallback);
}
exports.connectClient = connectClient;

//Function to send messages to IOT hub

// Message format
// {
//     "temperature": "",
//     "barometicPressure": ""
//     "humidityP": "",
//     "lux": "",
//     "deviceID": "",
//     "deviceLocation": "",
//     "deviceTimeStamp": ""
// }


function sendMessage(data) {
    var msg = JSON.parse(data);

    msg.deviceID = config.get('DeviceID');
    msg.deviceLocation = config.get('DeviceLocation');

    var mDate = new Date();
    msg.deviceTimeStamp = mDate.toISOString();

    var message = new Message(JSON.stringify(msg));

    logger.info("HubWorker: Sending message", message);
    client.sendEvent(message, printResultFor('send'));
}
exports.sendMessage = sendMessage;
