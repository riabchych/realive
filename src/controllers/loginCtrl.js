//
//  loginCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

import passport from 'passport'
import logger from '../utils/logger'

module.exports = (req, res, next) => {
    if (Object.is(req.method, 'POST')) {
        passport.authenticate('login', result => {
            if (result && Object.keys(result).includes('success') && result.success) {
                req.login = Promise.promisify(req.login)
                return req.login(result.extras.user).then(() => {
                    return res.redirect(`/user/${req.user.username}`)
                }).catch(data => {
                    logger.error(data.extras.msg)
                    return res.redirect('back')
                })
            } else {
                logger.error(result && Object.keys(result).includes('extras')
                    ? result.extras.msg
                    : 'Error!')
                return res.redirect('back')
            }
        })(req, res, next)

    } else {
        return res.render('login', {
            'title': 'Login',
            'csrfToken': encodeURIComponent(req.csrfToken())
        })
    }
}
