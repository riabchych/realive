//
//  review.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-24.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//
var _ = require("lodash");
var path = require('path');
var crypto = require('crypto');
var Promise = require("bluebird");
var mongoose = Promise.promisifyAll(require('mongoose'));
var convertBasicMarkup = require(path.join(global.config.paths.utils_dir, '/basicMarkup'));
var Review = require(path.join(global.config.paths.schemas_dir, '/review-schema'));
var UserModel = require(path.join(global.config.paths.models_dir, '/user'));
var ApiResponse = require(path.join(global.config.paths.config_dir, '/api-response.js'));
var ApiMessages = require(path.join(global.config.paths.config_dir, '/api-messages.js'));

Review.virtual('id')
    .get(function () {
        return mongoose.Types.ObjectId(this._id).str;
    });

Review.virtual('bodyParsed')
    .get(function () {
        return convertBasicMarkup(this.body, true);
    });

Review.pre('update', function () {
    this.update({}, { $set: { updatedAt: new Date() } });
});

Review.methods.createReview = function () {
    var self = this;
    return new Promise((resolve, reject) => {
        self.save().then(data => {
            if (!_.isEmpty(data)) {
                return data;
            } else {
                throw new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } });
            }
        }).then(data => {
            UserModel.incValue(self.to, { 'meta.numberOfReviews': 1 });
            return data;
        }).then(data => {
            return resolve(new ApiResponse({ success: true, extras: { review: data } }));
        }).catch(data => {
            return reject(new Error(data));
        });
    });
};

Review.statics.readReviews = function (id) {
    var self = this;
    return new Promise((resolve, reject) => {
        self.find({
            to: id
        })
            .limit(10)
            .sort({ createdAt: -1 })
            .populate('from', 'name id photo username')
            .exec()
            .then((data, err) => {
                if (_.isEmpty(err)) {
                    var reviews = [];
                    _.each(data, review => {
                        reviews.push(review);
                        console.log(review);
                    });

                    return reviews;
                } else {
                    throw new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } });

                }
            }).then(data => {
                return resolve(new ApiResponse({ success: true, extras: { reviews: data } }));
            }).catch(data => {
                return reject(new Error(data));
            });
    });
};
module.exports = mongoose.model('Review', Review);