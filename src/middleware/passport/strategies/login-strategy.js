//
//  login-strategy.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

let path = require('path');
let Promise = require("bluebird");
let LocalStrategy = require('passport-local').Strategy;
let ApiMessages = require(path.join(global.config.paths.config_dir, '/api-messages'));
let UserModel = require(path.join(global.config.paths.models_dir, '/user'));
let logger = require(path.join(global.config.paths.utils_dir, '/logger'));
let _ = require('lodash');

module.exports = passport => {
    passport.use('login', new LocalStrategy({
        usernameField: 'username',
        session: true,
        passReqToCallback: true
    }, (req, username, password, next) => {
        new UserModel({
                email: username
            })
            .userIsValid(username, password)
            .then(result => {
                logger.info('Авторизация прошла успешно!');
                return next(result);
            })
            .catch(result => {
                switch (result.extras.msg) {
                    case ApiMessages.NOT_FOUND:
                        logger.info(`Пользователь с логином "${username}" не найден`);
                        req.flash('error_messages', 'Пользователь не найден');
                        break;
                    case ApiMessages.INVALID_PWD:
                        logger.info('Неправильный пароль');
                        req.flash('error_messages', 'Неправильный пароль');
                        break;
                    default:
                        logger.info('Неизвестная ошибка');
                        req.flash('error_messages', 'Неизвестная ошибка');
                        break;
                }
                return next(result);
            });
    }));
};