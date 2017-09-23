//
//  edit.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//
var path = require('path');
var flashMessages = require(path.join(global.config.paths.utils_dir, '/flash'));
var UserProfile = require(path.join(global.config.paths.models_dir, '/user-profile.js'));
var UserController = require(path.join(global.config.paths.controllers_dir, '/user-controller.js'));
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    var params = {};

    if (req.method == "POST") {
        params = _.extend(req.query || {}, req.params || {}, req.body || {});
        req.login = Promise.promisify(req.login);
        return new UserController(req.user).updateUser(params.user)
            .catch(err => {
                console.log('error:', err);
            })
            .then(user => {
                req.login(user.extras.user)
                    .catch(function (err) {
                        new Error(err);
                    })
                    .then(function () {
                        res.redirect('back');
                    });
            })
            .catch(err => {
                console.log('error:', err);
            });
    }
    else {
        params.title = 'Редактирование :: ' + req.user.fullName + ' :: Dismus';
        params.csrfToken = encodeURIComponent(req.csrfToken());
        params.messages = flashMessages(req, res);
        params.owner = new UserProfile(req.user);

        return res.render('edit', params);
    }
};
