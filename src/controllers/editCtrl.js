//
//  editCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

import _ from 'lodash'
import util from 'util'
import Promise from 'bluebird'
import flashMessages from '../utils/flash'
import UserProfile from '../models/user-profile'
import UserModel from '../models/user'
import logger from '../utils/logger'

module.exports = (req, res) => {
    if (!req.isAuthenticated) {
        req.logout()
        return res.redirect('/login')
    } else if (_.isEqual(req.method, "POST")) {
        params = _.extend(req.query || {}, req.params || {}, req.body || {})
        if (!_.has(params, 'user')) {
            return res.redirect('back')
        } else {
            req.login = Promise.promisify(req.login)
            return new UserModel(req.user).updateUser(params.user).then(data => {
                return req.login(data.extras.user)
            }).then(() => {
                return res.redirect('back')
            }).catch(err => {
                logger.error('ERROR: ' + err.extras.msg)
                return res.redirect('back')
            })
        }
    } else {
        return res.render('edit', {
            title: 'Редактирование :: ' + req.user.fullName,
            csrfToken: encodeURIComponent(req.csrfToken()),
            messages: flashMessages(req, res),
            owner: new UserProfile(req.user)
        })
    }
}
