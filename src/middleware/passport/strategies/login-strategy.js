//
//  login-strategy.js
//  realive
//
//  Created by Yevheii Riabchych on 2017-09-21.
//  Copyright 2017 Yevheii Riabchych. All rights reserved.
//

'use strict';

var path = require('path');
var LocalStrategy = require('passport-local').Strategy;
var ApiMessages = require(path.join(global.config.paths.config_dir, '/api-messages'));
var UserModel = require(path.join(global.config.paths.models_dir, '/user'));
var userController = require(path.join(global.config.paths.controllers_dir, '/user-controller'));
var logger = require(path.join(global.config.paths.utils_dir, '/logger'));
var UserProfile = require(path.join(global.config.paths.models_dir, '/user-profile.js'));

module.exports = function (passport) {
    
    passport.use('login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true 
    }, function (req, username, password, done) {

        var userModel = new UserModel({ email: username });
        userController(userModel).userIsValid(username, password, function (err, result) {
            
            switch (result.extras.msg) {
                case ApiMessages.NOT_FOUND:
                    logger.info('User Not Found with login ' + ' ' + username);
                    req.flash('error_messages', 'User Not Found.');
                    done(null, result);
                    break;
                case ApiMessages.INVALID_PWD:
                    logger.info('Invalid Password');
                    req.flash('error_messages', 'Invalid Password');
                    done(null, result);
                    break;
                default:
                    logger.info('Login is successfully');
                    new UserModel(result.extras.user).logLogin();
                    done(null, result);
                    break;
            }
        });
    }));
};