//
//  app.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

import Promise from 'bluebird'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import sassMiddleware from 'node-sass-middleware'
import express from 'express'
import mongoose from 'mongoose'
import expressValidator from 'express-validator'
import favicon from 'serve-favicon'
import passport from 'passport'
import customValidators from './utils/custom-validators'
import methodOverride from 'method-override'
import flash from 'connect-flash'
import csrf from 'csurf'
import logger from './utils/logger'
import routes from './routes'
import morgan from 'morgan'
import passportInit from './middleware/passport/init'

class Events {

    constructor(port) {
        this.port = this.normalizePort(port)
    }

    onListening() {
        logger.info("Server listening on port " + this.port)
    }

    onError(error) {
        if (error.syscall !== 'listen') {
            throw error
        }

        let bind = typeof this.port === 'string'
            ? 'Pipe ' + this.port
            : 'Port ' + this.port

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                logger.error(bind + ' requires elevated privileges')
                process.exit(1)
                break
            case 'EADDRINUSE':
                logger.error(bind + ' is already in use')
                process.exit(1)
                break
            default:
                throw error
        }
    }

    normalizePort(val) {
        let port = parseInt(val, 10)

        if (isNaN(port)) {
            return val
        }

        if (port >= 0) {
            return port
        }

        return false
    }
}

class App extends Events {
    constructor(config, port = process.env.PORT || '8080') {
        super(port)
        this.init(config)
    }

    init(config) {
        this.app = express()
        this.app.set('views', __dirname + '/views')
        this.app.set('view engine', 'pug')
        this.app.use(favicon(__dirname + '/public/favicon.ico'))
        this.app.use(sassMiddleware({
            /* Options */
            src: __dirname + '/sass',
            dest: __dirname + '/public/css',
            indentedSyntax: true,
            debug: true,
            outputStyle: 'compressed',
            prefix: '/css'
        }))
        this.app.use(morgan('combined', {"stream": logger.stream}))
        this.app.use(methodOverride('X-HTTP-Method')) // Microsoft
        this.app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
        this.app.use(methodOverride('X-Method-Override')) // IBM

        let sessionParam = {
            secret: config.session.secret,
            saveUninitialized: config.session.saveUninitialized,
            resave: config.session.resave
        }

        this.app.use(express.static(__dirname + '/public'))
        this.app.use(cookieParser(config.cookies.secret))
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended: true}))
        this.app.use(expressSession(sessionParam))
        this.app.use(passport.initialize())
        this.app.use(passport.session())
        this.app.use(expressValidator({customValidators: customValidators}))
        this.app.use(flash())
        this.app.use(csrf({cookie: false}))

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
            socket.setNoDelay()
        })

        mongoose.connection.on('open', ref => {
            logger.info('Connected to mongo server.')
        })

        mongoose.connection.on('error', err => {
            logger.warn('Could not connect to mongo server!')
            logger.error(err)
        })

        mongoose.connect(this.initDbUri(config.db), {useMongoClient: true})
        return this.app
    }

    initDbUri(config) {
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

    run() {
        this.server = http.createServer(this.app).listen(this.port)
        this.server.on('listening', this.onListening.bind(this))
        this.server.on('error', this.onError.bind(this))
    }
}

export default App
