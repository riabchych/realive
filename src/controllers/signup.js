//
//  signap.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//
(function () {
    var path = require('path');
    var Promise = require('bluebird');
    var _ = require('lodash');
    var UserController = require(path.join(global.config.paths.controllers_dir, '/user-controller'));
    var schema = require(path.join(global.config.paths.utils_dir, '/schema-validation'));
    var logger = require(path.join(global.config.paths.utils_dir, '/logger'));

    module.exports = (req, res) => {
        if (req.method == "POST") {
            var params = _.extend(req.query || {}, req.params || {}, req.body || {});
            if (!_.has(params, 'user') && !_.has(params, 'user.name')) {
                return res.redirect('back');
            } else {
                var name = _.split(params.user.name, ' ');

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
                req.sanitize('email').normalizeEmail({ remove_dots: false });
                req.assert('repassword', 'Passwords do not match').equals(req.body.password);
                req.checkBody(schema);

                req.asyncValidationErrors().then(() => {
                    newUser = req.body;
                    delete newUser.repassword;

                    req.login = Promise.promisify(req.login);
                    return new UserController(newUser).createUser()
                        .then(result => {
                            if (_.has(result, 'success') && _.has(result, 'extras.user') && !_.isEmpty(result.extras.user)) {
                                logger.info("New account has been created");
                                req.flash('success_messages', 'Your account has been created');
                                //emails.sendWelcome(user);
                                return req.login(result.extras.user)
                                    .then(user => {
                                        logger.info("User " + result.extras.user.username + " has been logged");
                                        return res.redirect('/user/' + result.extras.user.username);
                                    });
                            } else {
                                throw new Error('Object \'user is\' empty');
                            }
                        })
                        .catch(err => {
                            throw new Error();
                        })
                }).catch(errors => {
                    _.each(errors, e => {
                        req.flash('error_messages', e.msg);
                    });
                    return res.redirect('back');
                });
            }
        } else {

            return res.render('signup', {
                title: "Регистрация",
                csrfToken: encodeURIComponent(req.csrfToken())
            });
        }
    };

}).call(this);