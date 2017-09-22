//
//  signap.js
//  realive
//
//  Created by Yevheii Riabchych on 2017-09-21.
//  Copyright 2017 Yevheii Riabchych. All rights reserved.
//
(function () {
    var path = require('path');
    var userController = require(path.join(global.config.paths.controllers_dir, '/user-controller'));
    var UserModel = require(path.join(global.config.paths.models_dir, '/user'));
    var schema = require(path.join(global.config.paths.utils_dir, '/schema-validation'));
    var util = require('util');
    var _ = require('lodash');
    var logger = require(path.join(global.config.paths.utils_dir, '/logger'));

    module.exports = function (req, res) {

        if (req.method == "POST") {
            var params = _.extend(req.query || {}, req.params || {}, req.body || {});
            var name = params.user.name.split(' ');

            var newUser = {};
            newUser.name = {};
            newUser.name.first = name[0] || '';
            newUser.name.last = name[1] || '';
            newUser.email = params.user.email;
            newUser.password = params.user.password;
            newUser.repassword = params.user.repassword;

            req.body = newUser;

            req.sanitize('name.first').trim();
            req.sanitize('name.last').trim();
            req.sanitize('email').normalizeEmail();

            req.assert('repassword', 'Passwords do not match').equals(req.body.password);
            req.checkBody(schema);

            req.asyncValidationErrors().then(function () {

                newUser = req.body;
                delete newUser.repassword;

                var userModel = new UserModel(newUser);

                return userController(userModel).createUser(function (err, info, extras) {

                    if (info && info.success && info.extras && info.extras.user) {
                        if (err) return res.redirect('back');
                        logger.info("New account has been created");
                        req.flash('success_messages', 'Your account has been created');
                        //emails.sendWelcome(user);
                        return req.logIn(info.extras.user, function (err, us) {
                            logger.info("User " + info.extras.user.username + " has been logged");
                            return res.redirect('/user/' + info.extras.user.username);
                        });
                    } else {
                        if ((info && info.extras) || (info && info.extras && info && info.extras.msg && err)) {
                            return err ? next(err) : res.redirect('back');
                        }

                        if (extras && extras.message) {
                            req.flash('error_messages', extras.message);
                            return res.redirect('back');
                        }
                        else {
                            return res.redirect('back');
                        }

                    }

                });
            }).catch(function (errors) {
                _.each(errors, function (e) {
                    req.flash('error_messages', e.msg);
                });

                return res.redirect('back');
            });
        } else {

            return res.render('signup', {
                title: "Регистрация",
                csrfToken: encodeURIComponent(req.csrfToken())
            });
        }
    };

}).call(this);