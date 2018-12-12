//
//  signup.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

import logger from '../utils/logger'
import config from '../config'
import UserModel from '../models/user'
import MailService from '../services/mailer-service'
import emailVerification from '../utils/email-verification'
import schema from '../schemas/validation/user-validation-schema'

export default (req, res) => {
    if (!Object.is(req.method, 'POST')) {
        return res.render('signup', {
            title: "Регистрация",
            csrfToken: encodeURIComponent(req.csrfToken())
        })
    }
    let params = req.body;
    if (!Object.keys(params).includes('user') && !Object.keys(params.user).includes('name')) {
        return res.redirect('back')
    }
    req.body.name = {};
    req.body.name.first = params.user.name.substr(0, params.user.name.indexOf(' ')) || req.body.name.first;
    req.body.name.last = params.user.name.substr(params.user.name.indexOf(' ') + 1) || req.body.name.last;
    req.body.email = params.user.email;
    req.body.password = params.user.password;
    req.body.repassword = params.user.repassword;

    req.sanitize('name.first').trim();
    req.sanitize('name.last').trim();
    req.sanitize('email').normalizeEmail({remove_dots: false});

    req.assert('repassword', 'Пароли не совпадают').equals(req.body.password);
    req.checkBody(schema);

    req.asyncValidationErrors().then(() => {
        return emailVerification.create(config.emailEncryptKey)
    }).then(obj => {
        return obj.encrypt(req.body.email)
    }).then(code => {
        req.body.verify_code = code;
        req.body.isNew = true;
        return new UserModel(req.body).createUser()
    }).then(result => {
        MailService.sendWelcome(result.extras.user);
        req.login = Promise.all(req.login);
        logger.info("Новый пользователь успешно зарегистрирован");
        req.flash('success_messages', 'Регистрация успешно завершена!');
        return req.login(result.extras.user)
    }).then(() => {
        logger.info(`Пользователь ${req.user.username} успешно авторизирован!`);
        return res.redirect(`/user/${req.user.username}`)
    }).catch(err => {
        if (Array.isArray(err)) {
            for (const e of err) {
                req.flash('error_messages', e.msg);
                logger.warn("VALIDATOR: " + e.msg)
            }
        } else {
            logger.error(`ERROR: ${err.extras.msg}`)
        }
        return res.redirect('back')
    })
}
