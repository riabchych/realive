//
//  emailCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-30.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

import config from '../config'
import UserModel from '../models/user'
import emailVerification from '../utils/email-verification.js'
import logger from '../utils/logger'

export default (req, res) => {
  if (Object.is(req.method, 'GET') && Object.keys(req).includes('params') &&
    req.params) {
    if (Object.is(req.params.action, 'confirm') && req.params.token) {
      return emailVerification.create(config.emailEncryptKey).then(obj => {
        return obj.decrypt(req.params.token)
      }).then(email => {
        return UserModel.findByEmail(email)
      }).then(data => {
        return UserModel.confirmEmail(data.extras.user.id)
      }).then(() => {
        logger.info('Адресс электронной почты успешно подтвержден!')
        return res.render('email-confirmed')
      }).catch(err => {
        logger.error(`ERROR: ${err.extras.msg}`)
        return res.redirect('/')
      })
    }
  }

  return res.redirect('/')
}
