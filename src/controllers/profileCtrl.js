//
//  profileCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

let path = require('path');
let flashMessages = require(path.join(global.config.paths.utils_dir, '/flash'));
let UserProfile = require(path.join(global.config.paths.models_dir, '/user-profile'));
let ReviewModel = require(path.join(global.config.paths.models_dir, '/review'));
let MailService = require(path.join(global.config.paths.services_dir, '/mailer-service'));
let UserModel = require(path.join(global.config.paths.models_dir, '/user'));
let logger = require(path.join(global.config.paths.utils_dir, '/logger'));
let _ = require('lodash');

module.exports = (req, res) => {
    let owner = req.user || {};

    if (req.isAuthenticated() && _.isEqual(owner.username, req.params.username)) {
        owner.isOwner = true;
        return ReviewModel
            .readReviews(owner.id)
            .then(result => {
                return renderProfile({
                    user: owner,
                    owner: owner,
                    reviews: result.extras.reviews
                });
            });
    } else if (_.has(req, 'params.username') && !_.isEmpty(req.params.username)) {
        let _data;
        new UserModel({
                'username': req.params.username
            })
            .readUser()
            .then(result => {
                result.extras.user.isOwner = false;
                return _data = {
                    user: result.extras.user,
                    owner: owner
                };
            })
            .then(result => {
                return ReviewModel.readReviews(result.user.id)
            })
            .then(result => {
                _data.reviews = result.extras.reviews;
                return _data;
            })
            .then(result => {
                return renderProfile(result);
            })
            .catch(err => {
                logger.error(`ERROR: ${err.extras.msg}`);
                req.logout();
                return res.redirect('/login');
            });
    } else {
        return res.redirect('/');
    }

    function renderProfile(data) {
        logger.debug(`Rendering page of username ${data.user.username}`);
        data.user = !_.isEmpty(data.user) ? new UserProfile(data.user) : data.user;
        data.owner = !_.isEmpty(data.owner) ? new UserProfile(data.owner) : data.owner;

        return res.render('profile', {
            title: data.user.fullName,
            user: data.user,
            owner: data.owner,
            reviews: data.reviews,
            csrfToken: encodeURIComponent(req.csrfToken()),
            messages: flashMessages(req, res)
        });
    }
};