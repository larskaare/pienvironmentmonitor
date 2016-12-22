'use strict';
/*jslint node: true */

var winston = require('winston');

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.File)({
            'filename': 'log/messages.log'
        })
    ]
});

module.exports = logger;