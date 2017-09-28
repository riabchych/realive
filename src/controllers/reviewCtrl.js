//
//  reviewCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//
var path = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var ReviewModel = require(path.join(global.config.paths.models_dir, '/review'));
var schema = require(path.join(global.config.paths.schemas_dir, '/validation/review-validation-schema'));
var logger = require(path.join(global.config.paths.utils_dir, '/logger'));

module.exports = (req, res) => {
    if (_.isEqual(req.method, "POST")) {
        if (_.has(req, 'params.action') && _.isEqual(req.params.action, 'new')) {
            var params = _.extend(req.body);
            if (!_.has(params, 'review') && !_.has(params, 'review.to')) {
                return res.redirect('back');
            } else {
                req.body.isNew = true;
                req.body.to = params.review.to;
                req.body.from = _.has(req, 'user._doc._id') ? req.user.id : undefined;
                req.body.isPrivate = params.review.isPrivate || false;
                req.body.isHidden = _.isEqual(params.review.isHidden, 'on');
                req.body.isPrivate = _.isEqual(params.review.isPrivate, 'on');
                req.body.body = params.review.text;
                req.body.toReview = params.review.toReview;
                req.sanitizeBody('body').trim();
                //req.checkBody(schema);

                return req.asyncValidationErrors().then(() => {
                    return new ReviewModel(req.body).createReview()
                        .then(result => {
                            if (_.has(result, 'success') && _.has(result, 'extras.review') && !_.isEmpty(result.extras.review)) {
                                logger.info("New review has been created");
                                req.flash('success_messages', 'Review has been sent');
                                return res.redirect('back');
                            } else {
                                throw new Error('Object \'review is\' empty');
                            }
                        })
                        .catch(err => {
                            throw new Error();
                        })
                }).catch(errors => {
                    _.each(errors, e => {
                        req.flash('error_messages', e.msg);
                        logger.debug("validator: " + e.msg);
                    });
                    return res.redirect('back');
                });
            }
        }
    }
    return res.render('home', { title: "Login" });
};