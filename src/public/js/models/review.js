//
//  review.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-10-31.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

import { Model } from 'backbone'

class Review extends Model {
  static defaults () {
    return {
      _id: undefined,
      to: '',
      from: '',
      toReview: '',
      body: '',
      isPrivate: '',
      isHidden: false,
      createdAt: '',
      updatedAt: '',
      unread: '',
      meta: {
        numberOfLikes: '',
        numberOfComments: ''
      }
    }
  }

  initialize () {
    console.log('"Review" model has been initialized.')
    this.on('change', function () {
      console.log('Values for "Review" model have changed.')
    })
  }
}

export default Review
