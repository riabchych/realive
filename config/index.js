//
//  index.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-10-04.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

import path from 'path'

let config = {}

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

config.paths = {}

config.paths.config_dir = path.join(__dirname)
config.paths.root_dir = path.join(__dirname, '..')
config.paths.logs_dir = path.join(__dirname, '../logs')
config.paths.src_dir = path.join(__dirname, '../src')
config.paths.sass_dir = path.join(__dirname, '../src/sass')
config.paths.public_dir = path.join(__dirname, '../src/public')
config.paths.views_dir = path.join(__dirname, '../src/views')
config.paths.errors_dir = path.join(__dirname, '../src/errors')
config.paths.middleware_dir = path.join(__dirname, '../src/middleware')
config.paths.schemas_dir = path.join(__dirname, '../src/schemas')
config.paths.models_dir = path.join(__dirname, '../src/models')
config.paths.services_dir = path.join(__dirname, '../src/services')
config.paths.utils_dir = path.join(__dirname, '../src/utils')
config.paths.helpers_dir = path.join(__dirname, '../src/helpers')
config.paths.controllers_dir = path.join(__dirname, '../src/controllers')

config.mailer = {}

config.mailer.host = 'localhost'
config.mailer.port = 25
config.mailer.from = 'admin@domain.local'
config.mailer.auth = {}
config.mailer.auth.user = 'admin@domain.local'
config.mailer.auth.pass = 'password'

export default config
