//
//  emailCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-30.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

let path = require('path');
let _ = require('lodash');
let logger = require(path.join(global.config.paths.utils_dir, '/logger'));
let emailVerification = require(path.join(global.config.paths.utils_dir, '/email-verification.js'));
let UserModel = require(path.join(global.config.paths.models_dir, '/user'));

module.exports = (req, res, next) => {
    if (_.isEqual(req.method, "GET") && _.has(req, 'params') && !_.isEmpty(req.params)) {
        let action = req.params.action;
        switch (action) {
            case 'confirm':
                if (req.params.token) {
                    emailVerification
                        .create(global.config.emailEncryptKey)
                        .then(obj => {
                            if (obj) {
                                return obj.decrypt(req.params.token);
                            } else {
                                throw new Error('Object is empty');
                            }
                        })
                        .then(email => {
                            if (email) {
                                return UserModel.findByEmail(email)
                            } else {
                                throw new Error('User has been deleted');
                            }
                        })
                        .then(user => {
                            if (user) {
                                return UserModel.confirmEmail(user.id);
                            } else {
                                throw new Error('Object "User" is empty');
                            }
                        })
                        .then(user => {
                            if (user) {
                                return res.render('email-confirmed');
                                logger.info('Email address has been confirmed!');
                            } else {
                                throw new Error('Object "User" is empty');
                            }
                        })
                        .catch(err => {
                            logger.error(`ERROR: ${err}`);
                            return res.redirect('/');
                        });
                }
                break;
            default:
                logger.debug('Invalid action name');
                return res.redirect('/');
                break;
        }
    } else {
        logger.debug('Invalid params');
        return res.redirect('/');
    }
};