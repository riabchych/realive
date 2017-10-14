//
//  editCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

let path = require('path');
let util = require('util');
let errors = require('errors');
let flashMessages = require(path.join(global.config.paths.utils_dir, '/flash'));
let UserProfile = require(path.join(global.config.paths.models_dir, '/user-profile'));
let UserModel = require(path.join(global.config.paths.models_dir, '/user'));
var logger = require(path.join(global.config.paths.utils_dir, '/logger'));
let Promise = require('bluebird');
let _ = require('lodash');

module.exports = (req, res) => {
    if (!req.isAuthenticated) {
        req.logout();
        return res.redirect('/login');
    } else if (_.isEqual(req.method, "POST")) {
        params = _.extend(req.query || {}, req.params || {}, req.body || {});
        if (!_.has(params, 'user')) {
            return res.redirect('back');
        } else {
            req.login = Promise.promisify(req.login);
            return new UserModel(req.user).updateUser(params.user)
                .then(data => {
                    return req.login(data.extras.user);
                })
                .then(function () {
                    return res.redirect('back');
                })
                .catch(err => {
                    logger.error('ERROR: ' + err.extras.msg);
                    return res.redirect('back');
                });
        }
    } else {
        return res.render('edit', {
            title: 'Редактирование :: ' + req.user.fullName,
            csrfToken: encodeURIComponent(req.csrfToken()),
            messages: flashMessages(req, res),
            owner: new UserProfile(req.user)
        });
    }
};