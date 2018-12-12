//
//  realive
//  error-handler.js
//
//  Created by Yevhenii Riabchych on 2015-11-03.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

import connectDomain from 'connect-domain'
import cluster from 'cluster'

export default (app) => {

    app.use(function (err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN') return next(err);

        res.status(err.status || 403);
        res.render('error', {
            message: 'Session has expired or tampered with',
            error: err
        });
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

    return app;
};