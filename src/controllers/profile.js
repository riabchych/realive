//
//  profile.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//
var path = require('path');
var flashMessages = require(path.join(global.config.paths.utils_dir, '/flash'));
var UserProfile = require(path.join(global.config.paths.models_dir, '/user-profile.js'));
var UserController = require(path.join(global.config.paths.controllers_dir, '/user-controller'));
var logger = require(path.join(global.config.paths.utils_dir, '/logger'));
var _ = require('lodash');

module.exports = (req, res) => {
    var owner = req.user || {};

    if (_.has(owner, '_doc.username') && _.has(req, 'params.username') && _.isEqual(owner.username, req.params.username)) {
        owner.isOwner = true;
        logger.info('Rendering page of owner');
        return renderProfile({ user: owner, owner: owner });

    } else if (_.has(req, 'params.username') && !_.isEmpty(req.params.username)) {
        new UserController({ 'username': req.params.username }).readUser()
            .then(result => {
                if (_.has(result, 'success') && _.has(result, 'extras.user') && !_.isEmpty(result.extras.user)) {
                    result.extras.user.isOwner = false;
                    logger.debug('Rendering page of username ' + result.extras.user.username);
                    return renderProfile({
                        user: result.extras.user,
                        owner: owner
                    });
                } else {
                    req.logout();
                    return res.redirect('/login');
                }
            })
            .catch(err => {
                req.logout();
                return res.redirect('/login');
            });
    } else {
        req.logout();
        return res.redirect('/login');
    }

    function renderProfile(data) {
        data.user = !_.isEmpty(data.user) ? new UserProfile(data.user) : data.user;
        data.owner = !_.isEmpty(data.owner) ? new UserProfile(data.owner) : data.owner;
        return res.render('profile', {
            title: data.user.fullName,
            user: data.user,
            owner: data.owner,
            csrfToken: encodeURIComponent(req.csrfToken()),
            messages: flashMessages(req, res)
        });
    }
}