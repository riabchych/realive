//
//  reviewCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

import ReviewModel from '../models/review'
import logger from '../utils/logger'

export default (req, res) => {
    if (!Object.is(req.method, 'POST') || !Object.keys(req.params).includes('action')) {
        return res.redirect('back')
    }

    switch (req.params.action) {
        case 'new':
            let params = req.body;
            if (!Object.keys(params).includes('review') && !Object.keys(params.review).includes('to')) {
                return res.redirect('back')
            }
            req.body.isNew = true;
            req.body.to = params.review.to;
            req.body.isPrivate = params.review.isPrivate || false;

            if (req.isAuthenticated()) {
                req.body.from = req.user.id;
                req.body.isHidden = Object.is(params.review.isHidden, 'on');
            }

            req.body.isPrivate = Object.is(params.review.isPrivate, 'on');
            req.body.body = params.review.text;
            req.body.toReview = params.review.toReview;
            req.sanitizeBody('body').trim();
            //req.checkBody(schema)

            return req.asyncValidationErrors().then(() => {
                return new ReviewModel(req.body).createReview()
            }).then(() => {
                logger.info("New review has been created");
                req.flash('success_messages', 'Review has been sent');
                return res.redirect('back')
            }).catch(err => {
                if (Array.isArray(err)) {
                    for (const e of err) {
                        req.flash('error_messages', e.msg);
                        logger.warn("VALIDATOR: " + e.msg)
                    }
                } else {
                    logger.error(`ERROR: ${err.extras.msg}`)
                }
                return res.redirect('back')
            });
            break;
        case 'list':
            if (Object.keys(req.body).includes('page') && Object.keys(req.body).includes('uid')) {
                let skips = 10 * (Number.parseInt(req.body.page) - 1);
                return ReviewModel.readReviews(req.body.uid, skips).then(result => {
                    return res.send(result)
                }).catch(err => {
                    return res.send(err)
                })
            }
            return res.send({success: false});
            break;
        case 'remove':
            if (req.isAuthenticated() && Object.keys(req.body).includes('id')) {
                return ReviewModel.delete(req.user.id, req.body.id).then(data => {
                    return res.send(data)
                }).catch(err => {
                    logger.error(`ERROR: ${err.extras.msg}`);
                    return res.send(err)
                })
            }
            return res.send({success: false});
            break;
        default:
            return res.redirect('back');
            break
    }
}
