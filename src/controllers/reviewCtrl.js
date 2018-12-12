//
//  reviewCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

import ReviewModel from '../models/review'
import logger from '../utils/logger'

export default (action, data) => {
  if (!action) {
    return
  }

  switch (action) {
    case 'create':
      let review = data.review

      review.isNew = true
      review.isPrivate = review.isPrivate || false

      /* if (req.isAuthenticated()) {
       req.body.from = req.user.id;
       req.body.isHidden = Object.is(params.review.isHidden, 'on');
       } */

      review.isPrivate = Object.is(review.isPrivate, 'on')

      return new ReviewModel(review).createReview().then(() => {
        return logger.info('New review has been created')
      }).catch(err => {
        if (Array.isArray(err)) {
          for (const e of err) {
            logger.warn('VALIDATOR: ' + e.msg)
          }
        } else {
          logger.error(`ERROR: ${err.extras.msg}`)
        }
      })
    case 'read':
      if (Object.keys(data).includes('page')) {
        let page = Number.parseInt(data.page)
        if (page < 1) { return }
        let skips = 10 * (page - 1)
        return ReviewModel.readReviews(data.uid, skips).then(result => {
          return result
        }).catch(err => {
          return err
        })
      }
      return {success: false}
    case 'remove':
      if (Object.keys(data).includes('id')) {
        return ReviewModel.delete(data.id, review.id).then(data => {
          return data
        }).catch(err => {
          logger.error(`ERROR: ${err.extras.msg}`)
          return err
        })
      }
      return {success: false}
    default:
      break
  }
}
