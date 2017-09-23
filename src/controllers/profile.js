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

module.exports = (req, res) => {
    var owner = req.user || {};

    if (owner && owner.username == req.params.username) {
        owner.isOwner = true;
        logger.info('Rendering page of owner');
        return renderProfile({ user: owner, owner: owner });

    } else if (req.params.username) {
        new UserController({ 'username': req.params.username }).readUser((err, result) => {
            if (result && result.success && result.extras && result.extras.user) {
                result.extras.user.isOwner = false;
                logger.debug('Rendering page of username ' + result.extras.user.username);
                return renderProfile({
                    user: result.extras.user,
                    owner: owner
                });
            } else {
                return res.redirect('/login');
            }
        });
    } else {
        return res.redirect('/login');
    }

    function renderProfile(data) {
        var params = {};
        data.user = data.user ? new UserProfile(data.user) : data.user;
        data.owner = data.owner ? new UserProfile(data.owner) : data.owner;
        params.title = data.user.fullName;
        params.user = data.user;
        params.owner = data.owner;
        params.csrfToken = req.csrfToken();
        params.messages = flashMessages(req, res);

        return res.render('profile', params);
    }
}