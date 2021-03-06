//
//  logger.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-30.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

import winston from 'winston'

winston.emitErrs = true;

let logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: __dirname + '/../../logs/app.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({level: 'debug', handleExceptions: true, json: false, colorize: true})
    ],
    exitOnError: false
});

logger.__proto__.stream = {
    write: function (message) {
        logger.info(message)
    }
};

export default logger