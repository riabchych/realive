//
//  index.js
//  realive
//
//  Created by Yevheii Riabchych on 2017-10-04.
//  Copyright 2017 Yevheii Riabchych. All rights reserved.
//

var path = require('path');

var config = module.exports = {};

config.host = process.env.IP || '127.0.0.1';
config.port = 8080;
config.env = 'development';

config.app = {};
config.app.useErrorHandler = false;

config.db = {}
config.db.host = '127.0.0.1';
config.db.port = 27017;
config.db.name = '';
config.db.username = '';
config.db.password = '';

config.session = {};
config.session.resave = true;
config.session.saveUninitialized = true;
config.session.secret = 'yourothersecretcode';
config.session.useStore = false;
config.session.storeHost = '127.0.0.1';
config.session.storePort = 27017;
config.session.storeTTL = '';

config.cookies = {};
config.cookies.domain = '127.0.0.1';
config.cookies.secret = 'mamamamama';

config.paths = {};
config.paths.src_dir = path.join(__dirname, '..');
config.paths.root_dir = path.join(__dirname, '../..');
config.paths.public_dir = path.join(__dirname, '../../public');
config.paths.views_dir = path.join(__dirname, '../views');
config.paths.config_dir = path.join(__dirname, '../config');
config.paths.errors_dir = path.join(__dirname, '../errors');
config.paths.logs_dir = path.join(__dirname, '../../logs');
config.paths.middleware_dir = path.join(__dirname, '../middleware');
config.paths.models_dir = path.join(__dirname, '../models');
config.paths.utils_dir = path.join(__dirname, '../utils');
config.paths.helpers_dir = path.join(__dirname, '../helpers');
config.paths.controllers_dir = path.join(__dirname, '../controllers');