//
//  app.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

import bodyParser from 'body-parser'
import flash from 'connect-flash'
import connectMongo from 'connect-mongo'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import express from 'express'
import session from 'express-session'
import expressValidator from 'express-validator'
import http from 'http'
import mongoose from 'mongoose'
import morgan from 'morgan'
import passport from 'passport'
import passportSocketIo from 'passport.socketio'
import favicon from 'serve-favicon'
import passportInit from './middleware/passport/init'
import routes from './routes'
import socket from './socket'
import customValidators from './utils/custom-validators'
import errorHanler from './utils/error-handler'
import logger from './utils/logger'

const MongoStore = connectMongo(session)

class AppListeners {
  constructor (port) {
    this.port = AppUtils.normalizePort(port)
  }

  onListening () {
    logger.info('Server listening on port ' + this.port)
  }

  onError (error) {
    if (error.syscall !== 'listen') {
      throw error
    }

    const bind = typeof this.port === 'string'
      ? 'Pipe ' + this.port
      : 'Port ' + this.port

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error(bind + ' requires elevated privileges')
        break
      case 'EADDRINUSE':
        logger.error(bind + ' is already in use')
        break
      default:
        throw error
    }
    process.exit(1)
  }
}

class AppUtils {
  static normalizePort (val) {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
      return val
    }

    if (port >= 0) {
      return port
    }

    return false
  }
}

class App {
  constructor (config, port = process.env.PORT || '8080') {
    this.port = port
    this.init(config)
  }

  static initDbUri (config) {
    return [
      'mongodb://', config.username
        ? (config.username + ':' + config.password + '@')
        : '',
      config.host,
      ':',
      config.port,
      config.name
        ? ('/' + config.name)
        : ''
    ].join('')
  }

  init (config) {
    this.app = express()
    this.app.set('views', `${__dirname}/views`)
    this.app.set('view engine', 'pug')
    this.app.use(favicon(`${__dirname}/public/favicon.ico`))
    this.app.use(morgan('combined', {'stream': logger.stream}))
    this.app.use(express.static(`${__dirname}/public`))
    this.app.use(cookieParser(config.cookies.secret))
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({extended: true}))
    mongoose.Promise = global.Promise
    mongoose.connection.on('open', () => {
      logger.info('Connected to mongo server.')

      let sessionStore = new MongoStore(
        {mongooseConnection: mongoose.connection})

      this.app.use(session({
        secret: config.session.secret,
        saveUninitialized: config.session.saveUninitialized,
        resave: config.session.resave,
        store: sessionStore
      }))
      this.app.use(passport.initialize())
      this.app.use(passport.session())
      this.app.use(expressValidator({customValidators: customValidators}))
      this.app.use(flash())
      this.app.use(csrf({cookie: false}))
      this.app = errorHanler(this.app)
      this.app.use((req, res, next) => {
        let msg = req.flash('success_messages')
        res.locals.success_messages = msg.length > 0
          ? msg
          : null
        msg = req.flash('error_messages')
        res.locals.error_messages = msg.length > 0
          ? msg
          : null
        next()
      })
      passportInit(passport)
      this.app.use(routes)

      this.app.on('connection', socket => {
        // socket.setNoDelay()
      })

      this.server = http.createServer(this.app)

      socket(this.server, passportSocketIo.authorize({
        key: 'connect.sid',
        secret: config.session.secret,
        store: sessionStore,
        passport: passport,
        cookieParser: cookieParser
      }))

      let appListeners = new AppListeners(this.port)
      this.server.on('listening', appListeners.onListening.bind(this))
      this.server.on('error', appListeners.onError.bind(this))
      this.server.listen(this.port)
    })

    mongoose.connection.on('error', err => {
      logger.error(err)
    })

    mongoose.connect(App.initDbUri(config.db), {useMongoClient: true})
  }
}

export default App
