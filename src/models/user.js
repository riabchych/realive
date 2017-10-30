//
//  user.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

import crypto from 'crypto'
import mongoose from 'mongoose'
import User from '../schemas/user-schema'
import ApiResponse from '../config/api-response'
import ApiMessages from '../config/api-messages'
import logger from '../utils/logger'
import checkData from '../utils/check-data'
import UserProfile from './user-profile'

User.virtual('id').get(function () {
    return this._id.toHexString()
});

User.virtual('password').set(function (password) {
    if (!password) {
        this.password_hash = null;
        return
    }
    this.salt = this.makeSalt();
    this.password_hash = this.encryptPassword(password)
}).get(function () {
    return this.password_hash
});

User.method('authenticate', function (plainText) {
    return this.encryptPassword(plainText) === this.password_hash
});

User.method('makeSalt', function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
});

User.method('encryptPassword', function (password) {
    return crypto.createHmac('sha256', this.salt).update(password).digest('hex')
});

User.method('passwordMatches', function (password) {
    return Object.is(this.password_hash, this.encryptPassword(password))
});

User.methods.findByUserName = function (username, callback) {
    return this.model("User").findOne({
        username: username
    }, callback)
};

User.statics.findByEmail = function (email) {
    return this.model("User").findOne({
        email: email
    }).then(checkData).then(data => {
        return Promise.resolve(new ApiResponse({
            success: true,
            extras: {
                user: data
            }
        }))
    }).catch(data => {
        return reject(data)
    })
};

User.virtual('name.full').get(function () {
    return this.name.first + ' ' + this.name.last
}).set(function (v) {
    this.name.first = v.substr(0, v.indexOf(' '));
    this.name.last = v.substr(v.indexOf(' ') + 1)
});

User.path("email").validate(function (email) {
    return email && !!email.match(/^.+@.+/)
});

User.method('logLogin', function () {
    this.update({id: this.id}, {$set: {last_login: new Date()}}, function (err) {
        if (err) {
            logger.warn('ERROR: Unable to logLogin.')
        }
    })
});

User.method('toJSON', function () {
    let obj = this.toObject();
    delete obj.password_hash;
    return obj
});

User.pre('save', function (next) {
    if (!this.password) {
        next(new Error('Invalid password'))
    } else {
        if (this.isNew) {
            this.username = this.makeSalt()
        }
        next()
    }

});

User.statics.incValue = function (id, field) {
    return new Promise((resolve, reject) => {
        this.findByIdAndUpdate(id, {
            $inc: field
        }).exec().then(checkData).then(data => {
            return resolve(new ApiResponse({
                success: true,
                extras: {
                    user: data
                }
            }))
        }).catch(data => {
            return reject(data)
        })
    })
};

User.statics.confirmEmail = function (id) {
    return new Promise((resolve, reject) => {
        this.findByIdAndUpdate(id, {
            status: 'valid'
        }).exec().then(checkData).then(data => {
            return resolve(new ApiResponse({
                success: true,
                extras: {
                    user: data
                }
            }))
        }).catch(data => {
            return reject(data)
        })
    })
};

User.methods.createUser = function () {
    return new Promise((resolve, reject) => {
        this.save().then(checkData).then(data => {
            return resolve(new ApiResponse({
                success: true,
                extras: {
                    user: data
                }
            }))
        }).catch(data => {
            return reject(data)
        })
    })
};

User.methods.deleteUser = function (id) {
    return new Promise((resolve, reject) => {
        this.remove({
            _id: id
        }).then(checkData).then(data => {
            return resolve(new ApiResponse({
                success: true,
                extras: {
                    user: data
                }
            }))
        }).catch(data => {
            return reject(data)
        })
    })
};

User.methods.readUser = function () {
    return new Promise((resolve, reject) => {
        this.findByUserName(this.username).then(checkData).then(data => {
            return resolve(new ApiResponse({
                success: true,
                extras: {
                    user: data
                }
            }))
        }).catch(data => {
            return reject(data)
        })
    })
};

User.methods.readAllUsers = function () {
    return new Promise((resolve, reject) => {
        this.model("User").find().then(checkData).then(data => {
            let users = [];
            for (const user of data) {
                users.push(new UserProfile({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }))
            }
                return data
        }).then(data => {
            return resolve(new ApiResponse({
                success: true,
                extras: {
                    userProfileModels: data
                }
            }))
        }).catch(data => {
            return reject(data)
        })
    })
};

User.methods.userIsValid = function (email, password) {
    return new Promise((resolve, reject) => {
        return this.model("User").findOne({
            email: email
        }).then(checkData).then(data => {
            this.salt = data.salt;
            this.password_hash = data.password_hash;
            if (!this.passwordMatches(password)) {
                return reject(new ApiResponse({
                    success: false,
                    extras: {
                        msg: ApiMessages.INVALID_PWD
                    }
                }))
            }
            return data
        }).then(data => {
            this.logLogin();
            return resolve(new ApiResponse({
                success: true,
                extras: {
                    user: data
                }
            }))
        }).catch(data => {
            return reject(data)
        })
    })
};

User.methods.updateUser = function (userIn) {
    let self = this;
    return new Promise((resolve, reject) => {
        if (userIn) {

            let updatedUser = {};

            Object.entries(userIn).forEach(([key, value]) => updatedUser[key] = value);

            {
                let n = updatedUser.name;
                if (n) {
                    updatedUser['name'] = {};
                    updatedUser['name']['first'] = n.substr(0, n.indexOf(' '));
                    updatedUser['name']['last'] = n.substr(n.indexOf(' ') + 1)
                }
            }

            self.model('User').findOneAndUpdate({
                _id: self.id
            }, updatedUser, {
                multi: false
            }).exec().then(checkData).then(data => {
                return resolve(new ApiResponse({
                    success: true,
                    extras: {
                        user: data
                    }
                }))
            }).catch(data => {
                return reject(data)
            })
        } else {
            return reject(new ApiResponse({
                success: false,
                extras: {
                    msg: ApiMessages.DB_ERROR
                }
            }))
        }
    })
};

export default mongoose.model('User', User);
