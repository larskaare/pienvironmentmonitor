'use strict';
/*jslint node: true */
/*jshint esversion: 6 */

require('app-module-path').addPath(process.env.PWD + '/lib/js');

//Defining logger
var winston = require('winston');
var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            'timestamp': true
        })
    ]
});

logger.info('MoniToInflux: Preparing to send messages from environent monitor to influxdb');

//Defining and loading config
var config = require("configger");


//Defining influxdb objects and config
logger.info('MoniToInflux: Connceting to InfluxDB');
const Influx = require('influx');
const influxOptions = {
    host: config.get('Influx_host') || 'localhost',
    database: config.get('Influx_db') || 'environment_data',
    schema: [{
        measurement: 'environment',
        fields: {
            temperature: Influx.FieldType.FLOAT,
            barometricpressure: Influx.FieldType.FLOAT,
            humidity: Influx.FieldType.FLOAT,
            lux: Influx.FieldType.FLOAT
        },
        tags: [
            'device_id', 'device_location'
        ]
    }]
};
const influx = new Influx.InfluxDB(influxOptions);

//Defining IOT Hub objects and connections
var EventHubClient = require('azure-event-hubs').Client;

if (!config.get('IOTHUB_CONNSTRING')) {
    logger.error('MoniToInflux: Unable to read IOT Hub connection string from config');
    process.exit(1);
} else {
    var connectionString = config.get('IOTHUB_CONNSTRING');
}

var printError = function(err) {
    logger.error('MoniToInflux:', err.message);
};

var printMessage = function(message) {

    if (config.get('SendToInfluxDB') === "true") {

        influx.writePoints([{
            measurement: 'environment',
            tags: {
                "device_id": message.body.deviceID,
                "device_location": message.body.deviceLocation
            },
            fields: {
                temperature: message.body.temperature,
                barometricpressure: message.body.barometicPressure,
                humidity: message.body.humidityP,
                lux: message.body.lux
            },
        }]).then(() => {
            return influx.query(`
            select * from environment
            where device_id = ${Influx.escape.stringLit(message.body.deviceID)}
            order by time desc
            limit 10
        `);
        }).then(rows => {
            rows.forEach(row => logger.info('MoniToInflux: Saving environment data ', row));
        }).catch(() => {
            logger.error('MoniToInflux: Unable to store iflux data');
        });
    } else {
        logger.info('MoniToInflux: Message received', message.body);
    }
};

//Connection to IOT Hub and listening for messages
logger.info('MoniToInflux: Connecting to iot hub');
var client = EventHubClient.fromConnectionString(connectionString);
client.open()
    .then(client.getPartitionIds.bind(client))
    .then(function(partitionIds) {
        return partitionIds.map(function(partitionId) {
            return client.createReceiver('$Default', partitionId, {
                'startAfterTime': Date.now()
            }).then(function(receiver) {
                logger.info('MoniToInflux : created partition receiver', partitionId);
                receiver.on('errorReceived', printError);
                receiver.on('message', printMessage);
            });
        });
    })
    .catch(printError);
