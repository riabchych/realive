//
//  user-profile.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

export default class {
  constructor (cnf) {
    this.id = cnf._id
    this.firstName = cnf.name.first
    this.lastName = cnf.name.last
    this.fullName = `${cnf.name.first} ${cnf.name.last}`
    this.userName = cnf.username
    this.email = cnf.email
    this.about = cnf.about
    this.website = cnf.website
    this.photo = cnf.photo
    this.isOwner = cnf.isOwner
    this.meta = cnf.meta
  }
}
