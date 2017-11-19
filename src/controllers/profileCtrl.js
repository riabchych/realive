//
//  profileCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

import ReviewModel from '../models/review'
import UserModel from '../models/user'
import UserProfile from '../models/user-profile'
import flashMessages from '../utils/flash'
import logger from '../utils/logger'

export default (req, res) => {
  let owner = req.user || {}

  if (req.isAuthenticated()) {
    if (Object.is(owner.username, req.params.username)) {
      owner.isOwner = true
      return ReviewModel.readReviews(owner.id).then(result => {
        return renderProfile({
          user: owner,
          owner: owner,
          reviews: result.extras.reviews
        })
      })
    }
  } else if (Object.keys(req.params).includes('username')) {
    if (req.params.username.length > 0) {
      let tmpData
      return new UserModel({username: req.params.username}).readUser()
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
          return renderProfile(result)
        })
        .catch(err => {
          logger.error(`ERROR: ${err.extras.msg}`)
          req.logout()
          return res.redirect('/login')
        })
    }
  }

  return res.redirect('/')

  function renderProfile (data) {
    logger.debug(`Rendering page of username ${data.user.username}`)
    data.user = Object.keys(data.user).length > 0
      ? new UserProfile(data.user)
      : data.user
    data.owner = Object.keys(data.owner).length > 0 ? new UserProfile(
      data.owner) : data.owner

    return res.render('profile', {
      title: data.user.fullName,
      user: data.user,
      owner: data.owner,
      reviews: data.reviews,
      csrfToken: encodeURIComponent(req.csrfToken()),
      messages: flashMessages(req, res)
    })
  }
}
