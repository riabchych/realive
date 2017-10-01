//
//  loginCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

var passport = require("passport");
var path = require('path');
var logger = require(path.join(global.config.paths.utils_dir, '/logger'));
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = (req, res, next) => {
    if (_.isEqual(req.method, "POST")) {
        new Promise((resolve, reject) => {
                passport.authenticate('login', result => {
                    return _.has(result, 'extras.user') ? resolve(result.extras.user) : reject();
                })(req, res, next);
            })
            .then(user => {
                if (!_.has(user, 'username') && _.isEmpty(user.username)) {
                    return new Promise.reject();
                } else {
                    req.login = Promise.promisify(req.login);
                    return req.login(user)
                        .then(() => {
                            logger.info(`User ${user.username} has been logged`);
                            return res.redirect(`/user/${user.username}`);
                        });
                }
            })
            .catch(() => {
                return res.redirect('back');
            });
    } else {
        res.render('login', {
            'title': 'Login',
            'csrfToken': encodeURIComponent(req.csrfToken())
        });
    }
};