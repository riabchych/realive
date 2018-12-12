//
//  isLoggedIn.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-30.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

export default function (req, res, next) {
  return req.isAuthenticated() ? next() : res.redirect('/login')
}
