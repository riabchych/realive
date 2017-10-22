//
//  init.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

import User from '../../models/user'
import loginStrategy from './strategies/login-strategy'

module.exports = passport => {

    passport.serializeUser((user, done) => {
        console.log('serializing user: ')
        console.log(user)
        done(null, user)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
            done(err, user)
        })
    })

    loginStrategy(passport)
}
