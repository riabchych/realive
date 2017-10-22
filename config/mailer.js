import nodemailer from 'nodemailer'
import Promise from 'bluebird'
import config from './index'

let transporter = nodemailer.createTransport({
    host: config.mailer.host,
    port: config.mailer.port,
    auth: {
        user: config.mailer.auth.user,
        pass: config.mailer.auth.pass
    }
})

module.exports = Promise.promisifyAll(transporter)
