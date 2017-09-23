//
//  login-strategy.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

var path = require('path');
var Promise = require("bluebird");
var LocalStrategy = require('passport-local').Strategy;
var ApiMessages = require(path.join(global.config.paths.config_dir, '/api-messages'));
var UserModel = require(path.join(global.config.paths.models_dir, '/user'));
var UserController = require(path.join(global.config.paths.controllers_dir, '/user-controller'));
var logger = require(path.join(global.config.paths.utils_dir, '/logger'));
var _ = require('lodash');

module.exports = passport => {
    passport.use('login', new LocalStrategy(
        {
            usernameField: 'username',
            session: true,
            passReqToCallback: true
        }, (req, username, password, next) => {
            new UserController({ email: username }).userIsValid(username, password)
                .then(result => {
                    logger.info('Login is successfully');
                    return next(result);
                })
                .catch(result => {
                    if (_.has(result, 'extras.msg')) {
                        switch (result.extras.msg) {
                            case ApiMessages.NOT_FOUND:
                                logger.info('User Not Found with login ' + ' ' + username);
                                req.flash('error_messages', 'User Not Found.');
                                return Promise.reject(result);
                                break;
                            case ApiMessages.INVALID_PWD:
                                logger.info('Invalid Password');
                                req.flash('error_messages', 'Invalid Password');
                                return Promise.reject(result);
                                break;
                            default:
                                logger.info('Internal Error');
                                return Promise.reject(result);
                                break;
                        }
                    } else {
                        logger.info('Internal Error');
                        return Promise.reject(result);
                    }
                })
                .catch(err => {
                    next(err)
                })
        }));
};