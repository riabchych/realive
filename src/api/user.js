//
//  user.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-11-26.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

import ApiMessages from '../config/api-messages'
import ApiResponse from '../config/api-response'
import ReviewModel from '../models/review'
import UserModel from '../models/user'
import UserProfile from '../models/user-profile'
import ApiError from '../utils/api-error'
import logger from '../utils/logger'

class UserController {
  constructor (req, res) {
    this.req = req
    this.res = res
  }

  getUser () {
    let owner = this.req.user || {}

    if (this.req.isAuthenticated()) {
      if (Object.is(owner.username, this.req.params.username)) {
        owner.isOwner = true
        return ReviewModel.readReviews(owner.id).then(result => {
          return this.renderProfile({
            user: owner,
            owner: owner,
            reviews: result.extras.reviews
          })
        })
      }
      return this.res.json(
        new ApiError('BAD REQUEST', ApiMessages.BAD_REQUEST).dump())
    }

    if (Object.keys(this.req.params).includes('username')) {
      if (this.req.params.username.length > 0) {
        let tmpData
        return new UserModel({username: this.req.params.username}).readUser()
          .then(result => {
            result.extras.user.isOwner = false
            tmpData = {
              user: result.extras.user,
              owner: owner
            }
            return tmpData
          })
          .then(result => {
            return ReviewModel.readReviews(result.user.id)
          })
          .then(result => {
            tmpData.reviews = result.extras.reviews
            return tmpData
          })
          .then(result => {
            return this.send(result)
          })
          .catch(err => {
            logger.error(`ERROR: ${err.extras.msg}`)
            return this.res.json(
              new ApiError('INTERNAL ERROR', ApiMessages.INTERNAL_ERROR).dump())
          })
      }
      return this.res.json(this.res.json(
        new ApiError('NOT FOUND', ApiMessages.NOT_FOUND).dump()))
    }
    return this.res.json(
      new ApiError('BAD REQUEST', ApiMessages.BAD_REQUEST).dump())
  }

  send (data) {
    let result = {}
    result.csrfToken = encodeURIComponent(this.req.csrfToken())

    if (Object.keys(data.reviews).length > 0) {
      result.reviews = new UserProfile(data.user)
    }

    if (Object.keys(data.user).length > 0) {
      result.user = new UserProfile(data.user)
    }

    if (Object.keys(data.owner).length > 0) {
      result.owner = new UserProfile(data.owner)
    }

    return this.res.json(
      new ApiResponse({
        success: true,
        extras: result
      }))
  }
}

export default UserController
