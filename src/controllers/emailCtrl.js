//
//  emailCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-30.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

import _ from 'lodash'
import logger from '../utils/logger'
import UserModel from '../models/user'
import emailVerification from '../utils/email-verification.js'

module.exports = (req, res, next) => {
    if (_.isEqual(req.method, "GET") && _.has(req, 'params') && !_.isEmpty(req.params)) {
        let action = req.params.action
        switch (action) {
            case 'confirm':
                if (req.params.token) {
                    emailVerification.create(global.config.emailEncryptKey).then(obj => {
                        return obj.decrypt(req.params.token)
                    }).then(email => {
                        return UserModel.findByEmail(email)
                    }).then(data => {
                        return UserModel.confirmEmail(data.extras.user.id)
                    }).then(data => {
                        logger.info('Адресс электронной почты успешно подтвержден!')
                        return res.render('email-confirmed')
                    }).catch(err => {
                        logger.error(`ERROR: ${err.extras.msg}`)
                        return res.redirect('/')
                    })
                }
                break
            default:
                return res.redirect('/')
                break
        }
    } else {
        return res.redirect('/')
    }
}
