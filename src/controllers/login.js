//
//  login.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

(function () {
    var passport = require("passport");
    var path = require('path');
    var logger = require(path.join(global.config.paths.utils_dir, '/logger'));
    var Promise = require('bluebird');
    //var should = require("should");

    module.exports = (req, res, next) => {
        if (req.method == "POST") {
            new Promise((resolve, reject) => {
                passport.authenticate('login', result => {
                    if (result && result.extras && result.extras.user) {
                        return resolve(result.extras.user);
                    } else {
                        return reject();
                    }
                })(req, res, next);
            })
                .then(user => {
                    if (!user) {
                        return Promise.reject();
                    }
                    req.login = Promise.promisify(req.login);
                    return req.login(user)
                        .then(() => {
                            logger.info("User " + user.username + " has been logged");
                            return res.redirect('/user/' + user.username);
                        });
                })
                .catch(err => {
                    return res.redirect('back');
                });


        } else {
            res.render('login', {
                'title' : 'Login',
                'csrfToken' : encodeURIComponent(req.csrfToken())
            });
        }
    };

}).call(this);