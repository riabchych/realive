//
//  api-error.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

import ApiResponse from '../config/api-response'

class ApiError extends Error {
  constructor (message, code) {
    super(message)
    this.code = code
    this.name = this.constructor.name
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }

  dump () {
    return new ApiResponse({
      success: false,
      extras: {
        code: this.code,
        message: this.message,
        stack: this.stack
      }
    })
  }
}

export default ApiError
