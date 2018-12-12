//
//  editCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

import flashMessages from '../utils/flash'
import UserProfile from '../models/user-profile'
import UserModel from '../models/user'
import logger from '../utils/logger'

export default (req, res) => {
    if (!req.isAuthenticated) {
        req.logout();
        return res.redirect('/login')
    }
    if (Object.is(req.method, 'POST')) {
        let params = req.body;

        if (!Object.keys(params).includes('user'))
            return res.redirect('back');

        return new UserModel(req.user).updateUser(params.user).then(data => {
            return req.logIn(data.extras.user, err => {
                if (err) {
                    logger.error(err);
                    return res.redirect('back')
                }
                return res.redirect('back')
            });
        }).catch(err => {
            logger.error('ERROR: ' + err.extras.msg);
            return res.redirect('back')
        })
    }
    return res.render('edit', {
        title: 'Редактирование :: ' + req.user.fullName,
        csrfToken: encodeURIComponent(req.csrfToken()),
        messages: flashMessages(req, res),
        owner: new UserProfile(req.user)
    })
}
