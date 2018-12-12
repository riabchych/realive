//
//  index.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-10-04.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

const config = {}

config.host = process.env.IP || '127.0.0.1'
config.port = 8080
config.env = 'development'
config.emailEncryptKey = 'r03n18y03a11mvvhr33'

config.app = {}
config.app.useErrorHandler = false

config.db = {}
config.db.host = '127.0.0.1'
config.db.port = 27017
config.db.name = ''
config.db.username = ''
config.db.password = ''

config.session = {}
config.session.resave = true
config.session.saveUninitialized = true
config.session.secret = 'yourothersecretcode'
config.session.useStore = false
config.session.storeHost = '127.0.0.1'
config.session.storePort = 27017
config.session.storeTTL = ''

config.cookies = {}
config.cookies.domain = '127.0.0.1'
config.cookies.secret = 'mamamamama'

config.mailer = {}

config.mailer.host = 'localhost'
config.mailer.port = 25
config.mailer.from = 'admin@domain.local'
config.mailer.auth = {}
config.mailer.auth.user = 'admin@domain.local'
config.mailer.auth.pass = 'password'

export default config
