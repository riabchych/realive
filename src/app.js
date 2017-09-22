//
//  app.js
//  realive
//
//  Created by Yevheii Riabchych on 2017-09-21.
//  Copyright 2017 Yevheii Riabchych. All rights reserved.
//

(function () {

    //var multer = require('multer');    
    var path = require('path');
    var bodyParser = require("body-parser");
    var cookieParser = require('cookie-parser');
    var expressSession = require('express-session');
    var express = require('express');
    var mongoose = require('mongoose');
    var expressValidator = require('express-validator');
    var favicon = require('serve-favicon');
    var passport = require('passport');
    var customValidators = require(path.join(global.config.paths.utils_dir, '/custom-validators'));
    var methodOverride = require('method-override');
    var flash = require('connect-flash');
    var csrf = require('csurf');
    var RedisStore = global.config.session.useStore ? require('connect-redis')(expressSession) : null;
    var logger = require(path.join(global.config.paths.utils_dir, '/logger'));
    var morgan = require('morgan');

    module.exports = function () {

        this.app = express();
        this.app.set('views', global.config.paths.views_dir);
        this.app.set('view engine', 'pug');
        this.app.engine('pug', require('pug').__express);
        this.app.use(favicon(path.join(global.config.paths.public_dir, '/favicon.ico')));
        this.app.use(morgan('combined', { "stream": logger.stream }));
        this.app.use(methodOverride('X-HTTP-Method')); // Microsoft
        this.app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
        this.app.use(methodOverride('X-Method-Override')); // IBM

        var sessionParam = {
            secret: global.config.session.secret,
            saveUninitialized: global.config.session.saveUninitialized,
            resave: global.config.session.resave
        };

        if (RedisStore !== null) {
            sessionParam.store = new RedisStore({
                host: global.config.session.storeHost,
                port: global.config.session.storePort,
                ttl: global.config.session.storeTTL
            });
        }

        this.app.use(expressSession(sessionParam));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static(global.config.paths.public_dir));
        this.app.use(expressValidator({ customValidators: customValidators }));
        this.app.use(cookieParser(global.config.cookies.secret));
        this.app.use(flash());
        this.app.use(csrf({ cookie: false }));

        this.app.use(function (req, res, next) {
            var msg = req.flash('success_messages');
            res.locals.success_messages = msg.length > 0 ? msg : null;
            msg = req.flash('error_messages');
            res.locals.error_messages = msg.length > 0 ? msg : null;
            next();
        });

        this.app.use(passport.initialize());
        this.app.use(passport.session());

        require(path.join(global.config.paths.middleware_dir + '/passport/init'))(passport);
        require(path.join(global.config.paths.src_dir, '/routes.js')).set(this.app);

        if (global.config.app.useErrorHandler) {
            require(path.join(global.config.paths.src_dir, '/error-handler')).set(this.app);
        }

        this.app.on('connection', function (socket) {
            socket.setNoDelay();
        });

        mongoose.connection.on('open', function (ref) {
            logger.info('Connected to mongo server.');
        });

        mongoose.connection.on('error', function (err) {
            logger.warn('Could not connect to mongo server!');
            logger.error(err);
        });

        this.initDbUri = function () {
            return ['mongodb://',
                global.config.db.username ? (global.config.db.username + ':' + global.config.db.password + '@') : '',
                global.config.db.host, ':',
                global.config.db.port,
                global.config.db.name ? ('/' + global.config.db.name) : ''
            ].join('');
        };

        mongoose.connect(this.initDbUri(), { useMongoClient: true });

        return this.app;
    };

}).call(this);