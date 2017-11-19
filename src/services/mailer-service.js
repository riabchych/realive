//
//  mailer-service.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-30.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

import pug from 'pug'
import util from 'util'
import config from '../config'
import mailer from '../config/mailer'
import logger from '../utils/logger'

class MailerService {
  static send (template, mailOptions, templateOptions) {
    mailOptions.html = this.renderPugFile(`${__dirname}'/../views/email-templates/${template}`, templateOptions)

    logger.debug('[SENDING MAIL]' + util.inspect(mailOptions))

    // if (app.settings.env == 'production') {
    mailer.sendMail(mailOptions, function (error, response) {
      if (error) {
        logger.error(error)
      } else {
        logger.info('Message sent: ' + response.message)
      }
    })
    // }
  }

  static sendWelcome (user) {
    this.send('welcome.pug', {
      to: user.email,
      from: config.mailer.from,
      subject: 'Подтверждение регистрации аккаунта на Realive.com'
    }, {
      locals: {
        user: user
      }
    })
  }

  static renderPugFile (template, options) {
    let fn = pug.compileFile(template, options)
    return fn(options.locals)
  }
}

export default MailerService
