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

logger.info('ReadDeviceMessage: Trying to read messages from device');

var config = require("configger");
var EventHubClient = require('azure-event-hubs').Client;

if (!config.get('IOTHUB_CONNSTRING')) {
  logger.error('ReadDeviceMessage: Unable to read connection string from config');
  process.exit(1);
} else {
  var connectionString = config.get('IOTHUB_CONNSTRING');
}

var printError = function (err) {
   logger.error('ReadDeviceMessage:',err.message);
 };

 var printMessage = function (message) {
   logger.info('ReadDeviceMessage: Message received',message.body); 
 };

logger.info('ReadDeviceMessage: Connecting to iot hub');

 var client = EventHubClient.fromConnectionString(connectionString);
 client.open()
     .then(client.getPartitionIds.bind(client))
     .then(function (partitionIds) {
         return partitionIds.map(function (partitionId) {
             return client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
                 logger.info('ReadDeviceMessage : created partition receiver',partitionId);
                 receiver.on('errorReceived', printError);
                 receiver.on('message', printMessage);
             });
         });
     })
     .catch(printError);