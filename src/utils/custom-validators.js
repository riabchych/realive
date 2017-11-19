//
//  custom-validators.js
//  realive
//
//  Created by Yevhenii Riabchych on 2016-10-25.
//  Copyright 2012 Yevhenii Riabchych. All rights reserved.
//

'use strict'

import UserModel from '../models/user'

export default {
  isEmailAvailable: email => {
    return new Promise((resolve, reject) => {
      UserModel.findOne({email: email}).then(user => {
        if (user) { reject(user) } else { resolve(user) }
      }).catch(error => {
        if (error) {
          reject(error)
        }
      })
    })
  },

  isName: value => {
    const regexp = /^[a-zA-Zа-яіїєґА-ЯІЇЄҐ]{2,}$/i
    return regexp.test(value)
  }
}
