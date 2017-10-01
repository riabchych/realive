//
//  init.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

let path = require('path');
let User = require(path.join(global.config.paths.models_dir, '/user'));
let loginStrategy = require(path.join(global.config.paths.middleware_dir, '/passport/strategies/login-strategy'));

module.exports = passport => {

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

    loginStrategy(passport);
};