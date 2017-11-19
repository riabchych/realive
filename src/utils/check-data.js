//
//  check-data.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-10-30.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

import ApiResponse from '../config/api-response'
import ApiMessages from '../config/api-messages'

export default (data, err) => {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(new ApiResponse({
        success: false,
        extras: {
          msg: ApiMessages.DB_ERROR
        }
      }))
    }
    if (!data) {
      return reject(new ApiResponse({
        success: false,
        extras: {
          msg: ApiMessages.NOT_FOUND
        }
      }))
    }
    return resolve(data)
  })
}
