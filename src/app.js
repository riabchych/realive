//
//  app.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

let Promise = require("bluebird");
let path = require('path');
let bodyParser = require("body-parser");
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');
let express = require('express');
let mongoose = Promise.promisifyAll(require('mongoose'));
let expressValidator = require('express-validator');
let favicon = require('serve-favicon');
let passport = require('passport');
let customValidators = require(path.join(global.config.paths.utils_dir, '/custom-validators'));
let methodOverride = require('method-override');
let flash = require('connect-flash');
let csrf = require('csurf');
let RedisStore = require(path.join(global.config.paths.config_dir, '/redis-store'));
let logger = require(path.join(global.config.paths.utils_dir, '/logger'));
let routes = require(path.join(global.config.paths.src_dir, '/routes'));
let morgan = require('morgan');

module.exports = () => {

    this.app = express();
    this.app.set('views', global.config.paths.views_dir);
    this.app.set('view engine', 'pug');
    this.app.engine('pug', require('pug').__express);
    this.app.use(favicon(path.join(global.config.paths.public_dir, '/favicon.ico')));
    this.app.use(morgan('combined', {
        "stream": logger.stream
    }));
    this.app.use(methodOverride('X-HTTP-Method')); // Microsoft
    this.app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
    this.app.use(methodOverride('X-Method-Override')); // IBM

    let sessionParam = {
        secret: global.config.session.secret,
        saveUninitialized: global.config.session.saveUninitialized,
        resave: global.config.session.resave
    };

    if (RedisStore !== null) {
        sessionParam.store = RedisStore;
    }

    this.app.use(express.static(global.config.paths.public_dir));
    this.app.use(cookieParser(global.config.cookies.secret));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
        extended: true
    }));
    this.app.use(expressSession(sessionParam));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(expressValidator({
        customValidators: customValidators
    }));
    this.app.use(flash());
    this.app.use(csrf({
        cookie: false
    }));

    this.app.use((req, res, next) => {
        let msg = req.flash('success_messages');
        res.locals.success_messages = msg.length > 0 ? msg : null;
        res.locals._ = require("lodash");
        msg = req.flash('error_messages');
        res.locals.error_messages = msg.length > 0 ? msg : null;
        next();
    });

    require(path.join(global.config.paths.middleware_dir + '/passport/init'))(passport);
    this.app.use(routes);

    if (global.config.app.useErrorHandler) {
        require(path.join(global.config.paths.src_dir, '/error-handler')).set(this.app);
    }

    this.app.on('connection', (socket) => {
        socket.setNoDelay();
    });

    mongoose.connection.on('open', (ref) => {
        logger.info('Connected to mongo server.');
    });

    mongoose.connection.on('error', function (err) {
        logger.warn('Could not connect to mongo server!');
        logger.error(err);
    });

    this.initDbUri = () => {
        return ['mongodb://',
            global.config.db.username ? (global.config.db.username + ':' + global.config.db.password + '@') : '',
            global.config.db.host, ':',
            global.config.db.port,
            global.config.db.name ? ('/' + global.config.db.name) : ''
        ].join('');
    };

    mongoose.connect(this.initDbUri(), {
        useMongoClient: true
    });
    return this.app;
};