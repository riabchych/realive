//
//  login-strategy.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

import { Strategy as LocalStrategy } from 'passport-local'
import ApiMessages from '../../../config/api-messages'
import UserModel from '../../../models/user'
import logger from '../../../utils/logger'

export default passport => passport.use('login', new LocalStrategy({
  usernameField: 'username',
  session: true,
  passReqToCallback: true
}, (req, username, password, next) => {
  new UserModel({
    email: username
  }).userIsValid(username, password).then(result => {
    logger.info('Авторизация прошла успешно!')
    return next(result)
  }).catch(result => {
    switch (result.extras.msg) {
      case ApiMessages.NOT_FOUND:
        logger.info(`Пользователь с логином "${username}" не найден`)
        req.flash('error_messages', 'Пользователь не найден')
        break
      case ApiMessages.INVALID_PWD:
        logger.info('Неправильный пароль')
        req.flash('error_messages', 'Неправильный пароль')
        break
      default:
        logger.info('Неизвестная ошибка')
        req.flash('error_messages', 'Неизвестная ошибка')
        break
    }
    return next(result)
  })
}))
