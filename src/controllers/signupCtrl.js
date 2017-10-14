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
            req.body.name = {};
            req.body.name.first = params.user.name.substr(0, params.user.name.indexOf(' ')) || req.body.name.first;
            req.body.name.last = params.user.name.substr(params.user.name.indexOf(' ') + 1) || req.body.name.last;
            req.body.email = params.user.email;
            req.body.password = params.user.password;
            req.body.repassword = params.user.repassword;

            req.sanitize('name.first').trim();
            req.sanitize('name.last').trim();
            req.sanitize('email').normalizeEmail({
                remove_dots: false
            });

            req.assert('repassword', 'Пароли не совпадают').equals(req.body.password);
            req.checkBody(schema);

            req.asyncValidationErrors()
                .then(() => {
                    return emailVerification.create(global.config.emailEncryptKey);
                })
                .then(object => {
                    return object.encrypt(req.body.email);
                })
                .then(code => {
                    req.body.verify_code = code;
                    req.body.isNew = true;
                    return new UserModel(req.body).createUser();
                })
                .then(result => {
                    MailService.sendWelcome(result.extras.user);
                    req.login = Promise.promisify(req.login);
                    logger.info("Новый пользователь успешно зарегистрирован");
                    req.flash('success_messages', 'Регистрация успешно завершена!');
                    return req.login(result.extras.user)
                })
                .then(() => {
                    logger.info(`Пользователь ${req.user.username} успешно авторизирован!`);
                    return res.redirect(`/user/${req.user.username}`);
                })
                .catch(err => {
                    if (_.isArray(err)) {
                        _.each(err, e => {
                            req.flash('error_messages', e.msg);
                            logger.warn("VALIDATOR: " + e.msg);
                        });
                    } else {
                        logger.error(`ERROR: ${err.extras.msg}`);
                    }
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