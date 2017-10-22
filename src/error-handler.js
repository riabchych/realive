//
//  realive
//  error-handler.js
//
//  Created by Yevhenii Riabchych on 2015-11-03.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

let connectDomain = require("connect-domain");
let cluster = require('cluster');

module.exports.set = function (app, instance) {

    app.use(function (err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN') return next(err);

        res.status(err.status || 403);
        res.render('error', {
            message: 'Session has expired or tampered with',
            error: err
        });
    });

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers
    // development error handler
    // will print stacktrace
    app.use(connectDomain());
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    } else {
        // production error handler
        // no stacktraces leaked to user
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }

    app.use(function (req, res, next) {
        if (cluster.isWorker) {
            console.log('### cluster info');
            console.log('Worker %d received request', cluster.worker.id);
        }
        next();
    });

    app.on('error', function (e) {
        if (e.code === 'EADDRINUSE') {
            console.log('Address in use, retrying...');
            //Send some notification about the error  
            process.exit(1);
        }
    });
};