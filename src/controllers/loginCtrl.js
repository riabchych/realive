//
//  loginCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

var passport = require('passport');
var path = require('path');
var logger = require(path.join(global.config.paths.utils_dir, '/logger'));
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = (req, res, next) => {
    if (_.isEqual(req.method, 'POST')) {
        passport.authenticate('login', result => {
            if (result.success) {
                req.login = Promise.promisify(req.login);
                return req.login(result.extras.user)
                    .then(() => {
                        return res.redirect(`/user/${req.user.username}`);
                    })
                    .catch(data => {
                        logger.error(data.extras.msg);
                        return res.redirect('back');
                    });
            } else {
                logger.error(result.extras.msg);
                return res.redirect('back');
            }
        })(req, res, next);

    } else {
        return res.render('login', {
            'title': 'Login',
            'csrfToken': encodeURIComponent(req.csrfToken())
        });
    }
};