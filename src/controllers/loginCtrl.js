//
//  loginCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

import passport from 'passport'
import logger from '../utils/logger'

export default (req, res, next) => {
    return !Object.is(req.method, 'POST') ? res.render('login', {
        'title': 'Login',
        'csrfToken': encodeURIComponent(req.csrfToken())
    }) : passport.authenticate('login', result => {

        if (result && Object.keys(result).includes('success')) {

            if (result.success) {

                return req.logIn(result.extras.user, err => {
                    if (err) {
                        logger.error(err);
                        return res.redirect('back')
                    }
                    return res.redirect(`/user/${req.user.username}`)
                });
            } else {
                logger.error(Object.keys(result).includes('extras') ? result.extras.msg : 'Error!');
            }
        }

        return res.redirect('back')

    })(req, res, next)
}
