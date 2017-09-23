//
//  init.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//
var path = require('path');
var User = require(path.join(global.config.paths.models_dir, '/user'));
var loginStrategy = require(path.join(global.config.paths.middleware_dir, '/passport/strategies/login-strategy'));

module.exports = passport => {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser((user, done) => {
        console.log('serializing user: ');
        console.log(user);
        done(null, user);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // Setting up Passport Strategies for Login
    loginStrategy(passport);
};