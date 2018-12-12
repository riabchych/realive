//
//  review.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-24.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

import mongoose from 'mongoose'
import ApiMessages from '../config/api-messages'
import ApiResponse from '../config/api-response'
import Review from '../schemas/review-schema'
import convertBasicMarkup from '../utils/basic-markup'
import checkData from '../utils/check-data'
import UserModel from './user'

Review.virtual('id').get(function () {
  return mongoose.Types.ObjectId(this._id).str
})

Review.virtual('bodyParsed').get(function () {
  return convertBasicMarkup(this.body, true)
})

Review.pre('update', function () {
  this.update({}, {
    $set: {
      updatedAt: new Date()
    }
  })
})

Review.methods.createReview = function () {
  let self = this
  return new Promise((resolve, reject) => {
    self.save().then(checkData).then(data => {
      UserModel.incValue(self.to, {'meta.numberOfReviews': 1})
      return data
    }).then(data => {
      return resolve(new ApiResponse({
        success: true,
        extras: {
          review: data
        }
      }))
    }).catch(data => {
      return reject(new ApiResponse({
        success: false,
        extras: {
          msg: ApiMessages.DB_ERROR
        }
      }))
    })
  })
}

Review.statics.readReviews = function (id, skip = 0) {
  let self = this
  return new Promise((resolve) => {
    self.find({to: id})
      .limit(10)
      .skip(skip)
      .sort({createdAt: -1})
      .populate('from', 'name id photo username')
      .exec()
      .then(checkData)
      .then(data => {
        let reviews = []
        for (const review of data) {
          reviews.push(review)
        }

        return reviews
      })
      .then(data => {
        return resolve(new ApiResponse({
          success: true,
          extras: {
            reviews: data
          }
        }))
      })
  })
}

Review.statics.delete = function (uid, id) {
  return new Promise((resolve, reject) => {
    this.model('Review')
      .remove({_id: id, to: uid})
      .then(checkData)
      .then(data => {
        if (data.result.ok) {
          UserModel.incValue(uid, {'meta.numberOfReviews': -1})
          return id
        } else {
          return reject(new ApiResponse({
            success: false,
            extras: {
              msg: ApiMessages.DB_ERROR
            }
          }))
        }
      })
      .then(id => {
        return resolve(new ApiResponse({
          success: true,
          extras: {
            review_id: id
          }
        }))
      })
  })
}

export default mongoose.model('Review', Review)
