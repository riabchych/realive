//
//  signup.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

import config from '../config'
import UserModel from '../models/user'
import schema from '../schemas/validation/user-validation-schema'
import MailService from '../services/mailer-service'
import emailVerification from '../utils/email-verification'
import logger from '../utils/logger'

export default (req, res) => {
  if (!Object.is(req.method, 'POST')) {
    return res.render('signup', {
      title: 'Регистрация',
      csrfToken: encodeURIComponent(req.csrfToken())
    })
  }
  let params = req.body
  if (!Object.keys(params).includes('user') &&
    !Object.keys(params.user).includes('name')) {
    return res.redirect('back')
  }
  req.body.name = {}
  req.body.name.first = params.user.name.substr(0,
    params.user.name.indexOf(' ')) || ''
  req.body.name.last = params.user.name.substr(params.user.name.indexOf(' ') +
    1) || ''
  req.body.email = params.user.email || ''
  req.body.password = params.user.password || ''
  req.body.repassword = params.user.repassword || ''

  req.sanitize('name.first').trim()
  req.sanitize('name.last').trim()
  req.sanitize('email').normalizeEmail({remove_dots: false})

  req.assert('repassword', 'Пароли не совпадают').equals(req.body.password)
  req.checkBody(schema)

  req.asyncValidationErrors().then(() => {
    return emailVerification.create(config.emailEncryptKey)
  }).then(obj => {
    return obj.encrypt(req.body.email)
  }).then(code => {
    req.body.verify_code = code
    req.body.isNew = true
    return new UserModel(req.body).createUser()
  }).then(result => {
    MailService.sendWelcome(result.extras.user)
    logger.info('Новый пользователь успешно зарегистрирован')
    req.flash('success_messages', 'Регистрация успешно завершена!')
    return new Promise((resolve, reject) => {
      req.logIn(result.extras.user, err => {
        if (err) {
          logger.error(err)
          reject(err)
        }
        resolve()
      })
    })
  }).then(() => {
    logger.info(`Пользователь ${req.user.username} успешно авторизирован!`)
    return res.redirect(`/user/${req.user.username}`)
  }).catch(err => {
    if (Array.isArray(err)) {
      for (const e of err) {
        req.flash('error_messages', e.msg)
        logger.warn('VALIDATOR: ' + e.msg)
      }
    } else {
      logger.error(`ERROR: ${err.extras.msg}`)
    }
    return res.redirect('back')
  })
}
