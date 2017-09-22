//
//  edit.js
//  realive
//
//  Created by Yevheii Riabchych on 2017-09-21.
//  Copyright 2017 Yevheii Riabchych. All rights reserved.
//
var path = require('path');
var flashMessages = require(path.join(global.config.paths.utils_dir, '/flash'));
var UserProfile = require(path.join(global.config.paths.models_dir, '/user-profile.js'));
var UserModel = require(path.join(global.config.paths.models_dir, '/user.js'));
var userController = require(path.join(global.config.paths.controllers_dir, '/user-controller.js'));
var _ = require('lodash');

module.exports = function (req, res) {
    if (!req.user) {
        return res.redirect('/login');
    }

    var params = {};

    if (req.method == "POST") {
        params = _.extend(req.query || {}, req.params || {}, req.body || {});
        var userModel = new UserModel(req.user);
        return userController(userModel).updateUser(params.user, function (err, user) {
            req.user = user;
            return req.login(user, function (err) {
                return res.redirect('back');
            });

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
