let nodemailer = require('nodemailer');
let P = require('bluebird');

let transporter = nodemailer.createTransport({
    host: global.config.mailer.host,
    port: global.config.mailer.port,
    auth: {
        user: global.config.mailer.auth.user,
        pass: global.config.mailer.auth.pass
    }
});

module.exports = P.promisifyAll(transporter);