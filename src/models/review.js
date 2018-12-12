//
//  review.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-24.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

import mongoose from 'mongoose'
import convertBasicMarkup from '../utils/basic-markup'
import Review from '../schemas/review-schema'
import UserModel from './user'
import ApiResponse from '../config/api-response'
import ApiMessages from '../config/api-messages'

Review.virtual('id').get(function () {
    return mongoose.Types.ObjectId(this._id).str
});

Review.virtual('bodyParsed').get(function () {
    return convertBasicMarkup(this.body, true)
});

Review.pre('update', function () {
    this.update({}, {
        $set: {
            updatedAt: new Date()
        }
    })
});

Review.methods.createReview = function () {
    let self = this;
    return new Promise((resolve, reject) => {
        self.save().then(data => {
            if (data) {
                return data
            } else {
                throw new ApiResponse({
                    success: false,
                    extras: {
                        msg: ApiMessages.DB_ERROR
                    }
                })
            }
        }).then(data => {
            UserModel.incValue(self.to, {'meta.numberOfReviews': 1});
            return data
        }).then(data => {
            return resolve(new ApiResponse({
                success: true,
                extras: {
                    review: data
                }
            }))
        }).catch(data => {
            return reject(new Error(data))
        })
    })
};

Review.statics.readReviews = function (id, skip = 0) {
    let self = this;
    return new Promise((resolve) => {
        self.find({to: id})
            .limit(10)
            .skip(skip)
            .sort({createdAt: -1})
            .populate('from', 'name id photo username')
            .exec()
            .then((data, err) => {
                if (!err) {
                    let reviews = [];
                    for (const review of data) {
                        reviews.push(review)
                    }

                    return reviews
                } else {
                    throw new ApiResponse({
                        success: false,
                        extras: {
                            msg: ApiMessages.DB_ERROR
                        }
                    })

                }
            }).then(data => {
            return resolve(new ApiResponse({
                success: true,
                extras: {
                    reviews: data
                }
            }))
        })
    })
};

Review.statics.delete = function (uid, id) {
    return new Promise((resolve) => {
        this.model('Review').remove({_id: id, to: uid}).then((data) => {
            if (data && data.result.ok) {
                UserModel.incValue(uid, {'meta.numberOfReviews': -1});
                return id
            } else {
                throw new ApiResponse({
                    success: false,
                    extras: {
                        msg: ApiMessages.DB_ERROR
                    }
                })
            }
        }).then(id => {
            return resolve(new ApiResponse({
                success: true,
                extras: {
                    review_id: id
                }
            }))
        })
    })
};

export default mongoose.model('Review', Review)
