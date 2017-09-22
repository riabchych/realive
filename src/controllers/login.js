//
//  login.js
//  realive
//
//  Created by Yevheii Riabchych on 2017-09-21.
//  Copyright 2017 Yevheii Riabchych. All rights reserved.
//

(function () {
    var passport = require("passport");
    var path = require('path');
    var logger = require(path.join(global.config.paths.utils_dir, '/logger'));
    //var should = require("should");

    module.exports = function (req, res, next) {
        var params = {};
        if (req.method == "POST") {

            passport.authenticate('login',
                function (err, info, extras) {

                    if (err) {
                        req.flash('error_messages', 'System error!');
                        logger.error('System error!');
                        return res.redirect('back');

                    } else if (info && info.success && info.extras && info.extras.user) {
                        return req.logIn(info.extras.user, function (err, user) {
                            if (!err) {
                                logger.info("User " + info.extras.user.username + " has been logged");
                                return res.redirect('/user/' + info.extras.user.username);
                            } else {
                                return next(err);
                            }
                        });

                    } else if ((info && info.extras) || (info && info.extras && info && info.extras.msg && err)) {
                        if (err) {
                            return next(err);
                        } else {
                            if (extras && extras.message) {
                                logger.error('Login failed!');
                                req.flash('error_messages', extras.message);
                            }
                        }
                    } else {
                        logger.error('System error!');
                        req.flash('error_messages', 'System error!');
                    }
                    return res.redirect('back');
                }
            )(req, res, next);
        } else {
            params.title = "Login";
            params.csrfToken = encodeURIComponent(req.csrfToken());
            res.render('login', params);
        }
    };

}).call(this);