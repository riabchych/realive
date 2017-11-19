//
//  user.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-11-06.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

import { Model } from 'backbone'

class User extends Model {
  constructor () {
    super()
    this.url = 'user'
  }

  static defaults () {
    return {
      name: {
        first: '',
        last: ''
      },
      birthday: '',
      sex: false,
      photo: '',
      about: '',
      website: '',
      location: '',
      username: '',
      email: '',
      registered: '',
      last_login: '',
      verify_code: '',
      status: '',
      meta: {
        numberOfReviews: 0,
        numberOfFollowers: 0,
        numberOfSubscriptions: 0
      },
      salt: ''
    }
  }

  initialize () {
    console.log('"User" model has been initialized.')
    this.on('change', function () {
      console.log('Values for "User" model have changed.')
    })
  }
}

export default new User()
