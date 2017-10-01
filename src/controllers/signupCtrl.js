//
//  signup.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

let path = require('path');
let Promise = require('bluebird');
let _ = require('lodash');
let mailer = require("nodemailer");
let UserModel = require(path.join(global.config.paths.models_dir, '/user'));
let MailService = require(path.join(global.config.paths.services_dir, '/mailer-service'));
let schema = require(path.join(global.config.paths.schemas_dir, '/validation/user-validation-schema'));
let logger = require(path.join(global.config.paths.utils_dir, '/logger'));
let emailVerification = require(path.join(global.config.paths.utils_dir, '/email-verification.js'));

module.exports = (req, res) => {
    if (req.method == "POST") {
        let params = _.extend(req.query || {}, req.params || {}, req.body || {});
        if (!_.has(params, 'user') && !_.has(params, 'user.name')) {
            return res.redirect('back');
        } else {
            let newUser = {};
            newUser.name = {};
            newUser.name.first = params.user.name.substr(0, params.user.name.indexOf(' ')) || newUser.name.first;
            newUser.name.last = params.user.name.substr(params.user.name.indexOf(' ') + 1) || newUser.name.last;
            newUser.email = params.user.email;
            newUser.password = params.user.password;
            newUser.repassword = params.user.repassword;

            req.body = newUser;
            req.sanitize('name.first').trim();
            req.sanitize('name.last').trim();
            req.sanitize('email').normalizeEmail({
                remove_dots: false
            });
            req.assert('repassword', 'Passwords do not match').equals(req.body.password);
            req.checkBody(schema);

            req.asyncValidationErrors().then(() => {
                newUser = req.body;
                newUser.verify_code = emailVerification.create(global.config.emailEncryptKey).encrypt(req.body.email);
                newUser.isNew = true;

                req.login = Promise.promisify(req.login);
                return new UserModel(newUser).createUser()
                    .then(result => {
                        if (_.has(result, 'success') && _.has(result, 'extras.user') && !_.isEmpty(result.extras.user)) {
                            logger.info("New account has been created");
                            req.flash('success_messages', 'Your account has been created');
                            MailService.sendWelcome(result.extras.user);
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