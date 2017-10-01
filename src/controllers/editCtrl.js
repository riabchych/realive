//
//  editCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

let path = require('path');
let flashMessages = require(path.join(global.config.paths.utils_dir, '/flash'));
let UserProfile = require(path.join(global.config.paths.models_dir, '/user-profile'));
let UserModel = require(path.join(global.config.paths.models_dir, '/user'));
let Promise = require('bluebird');
let _ = require('lodash');

module.exports = (req, res) => {
    if (!_.has(req, 'user') && !_.has(req.user, '_doc.username')) {
        req.logout();
        return res.redirect('/login');
    }

    if (req.method == "POST") {
        params = _.extend(req.query || {}, req.params || {}, req.body || {});
        if (!_.has(params, 'user')) {
            return res.redirect('back');
        } else {
            req.login = Promise.promisify(req.login);
            return new UserModel(req.user).updateUser(params.user)
                .catch(err => {
                    console.log('ERROR:', err);
                })
                .then(data => {
                    if (!_.has(data, 'extras.user')) {
                        throw new Error('Object \'user is\' empty');
                    } else {
                        req.login(data.extras.user)
                            .catch(function (err) {
                                new Error(err);
                            })
                            .then(function () {
                                res.redirect('back');
                            });
                    }
                })
                .catch(err => {
                    console.log('ERROR:', err);
                });
        }
    }
    else {
        return res.render('edit', {
            title: 'Редактирование :: ' + req.user.fullName,
            csrfToken: encodeURIComponent(req.csrfToken()),
            messages: flashMessages(req, res),
            owner: new UserProfile(req.user)
        });
    }
};
