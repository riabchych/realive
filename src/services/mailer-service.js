//
//  mail-service.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-30.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

let _ = require('lodash');
let pug = require('pug');
let path = require('path');
let util = require('util');
let mailer = require(path.join(global.config.paths.config_dir, '/mailer'));
let logger = require(path.join(global.config.paths.utils_dir, '/logger'));


function renderPugFile(template, options) {
    let fn = pug.compileFile(template, options);
    return fn(options.locals);
}

function MailerService() {}

_.extend(MailerService.prototype, {
    send: function (template, mailOptions, templateOptions) {
        mailOptions.html = renderPugFile(path.join(global.config.paths.views_dir,
            '/email-templates/' + template), templateOptions);

        logger.debug('[SENDING MAIL]' + util.inspect(mailOptions));

        //if (app.settings.env == 'production') {
        mailer.sendMail(mailOptions, function (error, response) {
            if (error) {
                logger.error(error);
            } else {
                logger.info("Message sent: " + response.message);
            }
        });
        //}
    },
    sendWelcome: function (user) {
        this.send('welcome.pug', {
            to: user.email,
            from: global.config.mailer.from,
            subject: 'Подтверждение регистрации аккаунта на Realive.com'
        }, {
            locals: {
                user: user
            }
        });
    }
});

module.exports = new MailerService();