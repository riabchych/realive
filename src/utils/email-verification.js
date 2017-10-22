//
//  email-verification.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-30.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

let crypto = require('crypto');
let Promise = require("bluebird");

let EmailVerification = function (secret) {
    this.cipher = crypto.createCipher('aes-256-cbc', secret);
    this.decipher = crypto.createDecipher('aes-256-cbc', secret);
};

EmailVerification.prototype.encrypt = function (text) {
    return new Promise((resolve, reject) => {
        let crypted = this.cipher.update(text, 'utf8', 'hex');
        crypted += this.cipher.final('hex');
        return resolve(crypted);
    });
};

EmailVerification.prototype.decrypt = function (text) {
    return new Promise((resolve, reject) => {
        let dec = this.decipher.update(text, 'hex', 'utf8');
        dec += this.decipher.final('utf8');
        return resolve(dec);
    });
};

module.exports.create = function (secret) {
    return new Promise((resolve, reject) => {
        if (!secret) {
            throw Error('secret key missing');
        } else {
            return resolve(new EmailVerification(secret));
        }
    });
};