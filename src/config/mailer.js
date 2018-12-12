//
//  mailer.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-10-04.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

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
});

export default Promise.promisifyAll(transporter)
