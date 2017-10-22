//
//  reviewCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

import Promise from 'bluebird'
import _ from 'lodash'
import ReviewModel from '../models/review'
import schema from '../schemas/validation/review-validation-schema'
import logger from '../utils/logger'

module.exports = (req, res) => {
    if (_.isEqual(req.method, "POST")) {
        if (_.has(req, 'params.action')) {
            switch (req.params.action) {
                case 'new':
                    let params = _.extend(req.body)
                    if (!_.has(params, 'review') && !_.has(params, 'review.to')) {
                        return res.redirect('back')
                    } else {
                        req.body.isNew = true
                        req.body.to = params.review.to
                        req.body.from = req.isAuthenticated() && _.has(req, 'user._doc._id')
                            ? req.user.id
                            : undefined
                        req.body.isPrivate = params.review.isPrivate || false
                        req.body.isHidden = req.isAuthenticated()
                            ? _.isEqual(params.review.isHidden, 'on')
                            : true
                        req.body.isPrivate = _.isEqual(params.review.isPrivate, 'on')
                        req.body.body = params.review.text
                        req.body.toReview = params.review.toReview
                        req.sanitizeBody('body').trim()
                        //req.checkBody(schema)

                        return req.asyncValidationErrors().then(() => {
                            return new ReviewModel(req.body).createReview()
                        }).then(result => {
                            logger.info("New review has been created")
                            req.flash('success_messages', 'Review has been sent')
                            return res.redirect('back')
                        }).catch(err => {
                            if (_.isArray(err)) {
                                _.each(err, e => {
                                    req.flash('error_messages', e.msg)
                                    logger.warn("VALIDATOR: " + e.msg)
                                })
                            } else {
                                logger.error(`ERROR: ${err.extras.msg}`)
                            }
                            return res.redirect('back')
                        })
                    }
                    break
                case 'list':
                    if (_.has(req.body, 'page') && _.has(req.body, 'uid')) {
                        let skips = 10 * (_.parseInt(req.body.page) - 1)
                        return ReviewModel.readReviews(req.body.uid, skips).then(result => {
                            return res.send(result)
                        }).catch(err => {
                            return res.send(err)
                        })
                    } else {
                        return res.send({success: false})
                    }
                    break
                case 'remove':
                    if (req.isAuthenticated() && _.has(req.body, 'id')) {
                        return ReviewModel.delete(req.user.id, req.body.id).then(data => {
                            return res.send(data)
                        }).catch(err => {
                            logger.error(`ERROR: ${err.extras.msg}`)
                            return res.send(err)
                        })
                    } else {
                        return res.send({success: false})
                    }
                    break
                default:
                    return res.redirect('back')
                    break
            }
        }
    } else {
        return res.redirect('back')
    }
}
