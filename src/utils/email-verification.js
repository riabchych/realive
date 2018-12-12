//
//  email-verification.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-30.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

import crypto from 'crypto';

class EmailVerification {
    constructor(secret) {
        this.cipher = crypto.createCipher('aes-256-cbc', secret);
        this.decipher = crypto.createDecipher('aes-256-cbc', secret);
    }

    encrypt(text) {
        return new Promise((resolve) => {
            let crypted = this.cipher.update(text, 'utf8', 'hex');
            crypted += this.cipher.final('hex');
            return resolve(crypted);
        });
    }

    decrypt(text) {
        return new Promise((resolve) => {
            let dec = this.decipher.update(text, 'hex', 'utf8');
            dec += this.decipher.final('utf8');
            return resolve(dec);
        });
    }
}

export default EmailVerification;

export function create(secret) {
    return new Promise((resolve) => {
        if (!secret) {
            throw Error('secret key missing');
        } else {
            return resolve(new EmailVerification(secret));
        }
    });
}