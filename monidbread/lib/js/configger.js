'use strict';
/*jslint node: true */

var configger = require('nconf');
var logger = require("logger.js");

// Loading from commandline, environment and then file - with presedence!

configger.argv();
configger.env();
configger.file({
    file: './config/config.json'
});

logger.info('configger: Config loaded');
module.exports = configger;
