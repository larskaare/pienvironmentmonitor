'use strict';
/*jslint node: true */

require('app-module-path').addPath(process.env.PWD + '/lib/js');

var config = require("configger");
var logger = require("logger.js");  //Logging goes to file - monidbread.log

var documentClient = require("documentdb").DocumentClient;
var moment = require('moment');

// Getting key config
var host = config.get('AZ_HOST_URL') || "";
var masterKey = config.get('AZ_MASTER_KEY') || "";
var dbLink = config.get('dbLink') || "";
var collLink = dbLink + '/colls/' + config.get('collName') || "";

if (host == "" || masterKey == "" || dbLink == "" || collLink == "") {
    logger.error("Missing config - exiting");
    process.exit();
}

var client = new documentClient(host, { masterKey: masterKey });

// Defining base document query
var querySpec = {
    query: 'SELECT * FROM devicedata d WHERE d.time > @documentTime',
    parameters: [
        {
            name: '@documentTime',
            value: ''
        }
    ]
};

// Setting starting timestamp to now() - 5 seconds
var timeStamp = new Date().toISOString();
querySpec.parameters[0].value = moment(timeStamp).subtract(5, 'seconds');

// Error function - will print information and exit process
function handleError(error) {
    logger.error('\nAn error with code \'' + error.code + '\' has occurred:');
    logger.error('\t' + JSON.parse(error.body).message);
    process.exit();
};

// Function to call documentdb query with callback
function getLatestDocuments(timeStamp, callback) {
    client.queryDocuments(collLink, querySpec).toArray(callback)
};


logger.info('Ready to read documents - setting interval to ' + config.get('readInterval') || 5000);

// Main loop
var interval = setInterval(function () {

    // Updating timeStamp in base query
    querySpec.parameters[0].value = timeStamp;

    // Get documents - if any - dump to console
    getLatestDocuments(timeStamp, function (err, results) {
        if (err) {
            handleError(err);
        } else if (results.length == 0) {
            logger.info("No documents retrieved",timeStamp);
        } else if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                console.log(results[i]);
            }
            logger.info(results.length + " documents retrieved");

            //Updating timeStamp with from last document in the collection
            timeStamp = (results[results.length - 1].time);
            logger.info('Advancing timestamp to ' + timeStamp);
        }
    });
}, config.get('readInterval') || 5000);
