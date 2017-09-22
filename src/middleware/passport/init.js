//
//  init.js
//  realive
//
//  Created by Yevheii Riabchych on 2017-09-21.
//  Copyright 2017 Yevheii Riabchych. All rights reserved.
//
var path = require('path');
var User = require(path.join(global.config.paths.models_dir, '/user'));
var login = require(path.join(global.config.paths.middleware_dir, '/passport/strategies/login-strategy'));

module.exports = function(passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');
        console.log(user);
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // Setting up Passport Strategies for Login
    login(passport);
};