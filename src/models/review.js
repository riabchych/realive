//
//  review.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-24.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

let _ = require("lodash");
let path = require('path');
let crypto = require('crypto');
let Promise = require("bluebird");
let mongoose = Promise.promisifyAll(require('mongoose'));
let convertBasicMarkup = require(path.join(global.config.paths.utils_dir, '/basic-markup'));
let Review = require(path.join(global.config.paths.schemas_dir, '/review-schema'));
let UserModel = require(path.join(global.config.paths.models_dir, '/user'));
let ApiResponse = require(path.join(global.config.paths.config_dir, '/api-response'));
let ApiMessages = require(path.join(global.config.paths.config_dir, '/api-messages'));

Review.virtual('id')
    .get(function () {
        return mongoose.Types.ObjectId(this._id).str;
    });

Review.virtual('bodyParsed')
    .get(function () {
        return convertBasicMarkup(this.body, true);
    });

Review.pre('update', function () {
    this.update({}, {
        $set: {
            updatedAt: new Date()
        }
    });
});

Review.methods.createReview = function () {
    let self = this;
    return new Promise((resolve, reject) => {
        self.save().then(data => {
            if (!_.isEmpty(data)) {
                return data;
            } else {
                throw new ApiResponse({
                    success: false,
                    extras: {
                        msg: ApiMessages.DB_ERROR
                    }
                });
            }
        }).then(data => {
            UserModel.incValue(self.to, {
                'meta.numberOfReviews': 1
            });
            return data;
        }).then(data => {
            return resolve(new ApiResponse({
                success: true,
                extras: {
                    review: data
                }
            }));
        }).catch(data => {
            return reject(new Error(data));
        });
    });
};

Review.statics.readReviews = function (id, skip = 0) {
    let self = this;
    return new Promise((resolve, reject) => {
        self.find({
                to: id
            })
            .limit(10)
            .skip(skip)
            .sort({
                createdAt: -1
            })
            .populate('from', 'name id photo username')
            .exec()
            .then((data, err) => {
                if (_.isEmpty(err)) {
                    let reviews = [];
                    _.each(data, review => {
                        reviews.push(review);
                    });

                    return reviews;
                } else {
                    throw new ApiResponse({
                        success: false,
                        extras: {
                            msg: ApiMessages.DB_ERROR
                        }
                    });

                }
            }).then(data => {
                return resolve(new ApiResponse({
                    success: true,
                    extras: {
                        reviews: data
                    }
                }));
            });
    });
};

Review.statics.delete = function (uid, id) {
    return new Promise((resolve, reject) => {
        this.model('Review').remove({
            _id: id,
            to: uid
        }).then((data) => {
            if (!_.isEmpty(data) && data.result.ok) {
                UserModel.incValue(uid, {
                    'meta.numberOfReviews': -1
                });
                return id;
            } else {
                throw new ApiResponse({
                    success: false,
                    extras: {
                        msg: ApiMessages.DB_ERROR
                    }
                });
            }
        }).then(id => {
            return resolve(new ApiResponse({
                success: true,
                extras: {
                    review_id: id
                }
            }));
        });
    });
};

module.exports = mongoose.model('Review', Review);