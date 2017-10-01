//
//  user.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//
let path = require('path');
let crypto = require('crypto');
let Promise = require("bluebird");
let _ = require("lodash");
let mongoose = Promise.promisifyAll(require('mongoose'));
let uuid = require('node-uuid');
let User = require(path.join(global.config.paths.schemas_dir, '/user-schema'));
let ApiResponse = require(path.join(global.config.paths.config_dir, '/api-response.js'));
let ApiMessages = require(path.join(global.config.paths.config_dir, '/api-messages.js'));
let UserProfile = require(path.join(global.config.paths.models_dir, '/user-profile.js'));

User.virtual('id')
    .get(function () {
        return this._id.toHexString();
    });

User.virtual('password')
    .set(function (password) {
        if (!password) {
            this.password_hash = null;
            return;
        }
        this.salt = this.makeSalt();
        this.password_hash = this.encryptPassword(password);
    })
    .get(function () {
        return this.password_hash;
    });

User.method('authenticate', function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
});

User.method('makeSalt', function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
});

User.method('encryptPassword', function (password) {
    return crypto.createHmac('sha256', this.salt).update(password).digest('hex');
});

User.method('passwordMatches', function (password) {
    return this.password_hash == this.encryptPassword(password)
});

User.methods.findByUserName = function (username, callback) {
    return this.model("User").findOne({ username: username }, callback);
};

User.statics.findByEmail = function (email, callback) {
    return this.model("User").findOne({ email: email });
};

User.virtual('name.full').
    get(function () { return this.name.first + ' ' + this.name.last; }).
    set(function (v) {
        this.name.first = v.substr(0, v.indexOf(' '));
        this.name.last = v.substr(v.indexOf(' ') + 1);
    });

User.path("email")
    .validate(function (email) {
        return email && !!email.match(/^.+\@.+/);
    });

User.method('logLogin', function () {
    this.update({ _id: this.id }, { $set: { last_login: new Date() } }, function (err, user) {
        if (err) {
            console.log('ERROR: Unable to logLogin. Unable to save: ', err);
        }
    });
});

User.method('toJSON', function () {
    let obj = this.toObject();
    delete obj.password_hash;
    return obj;
});

User.pre('save', function (next) {
    if (_.isEmpty(this.password)) {
        next(new Error('Invalid password'));
    }
    else {
        if (this.isNew) {
            this.username = this.makeSalt();
        }
        next();
    }

});

User.statics.incValue = function (id, field) {
    return new Promise((resolve, reject) => {
        this.findByIdAndUpdate(id, { $inc: field }).exec()
            .then((data, err) => {
                if (!err || !_.isEmpty(data)) {
                    return data;
                } else {
                    throw new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } });
                }
            }).then(data => {
                return resolve(new ApiResponse({ success: true, extras: { user: data } }));
            }).catch(data => {
                return reject(new Error(data));
            });
    });
};

User.statics.confirmEmail = function (id) {
    return new Promise((resolve, reject) => {
        this.findByIdAndUpdate(id, { status: 'valid' }).exec()
            .then((data, err) => {
                if (!err || !_.isEmpty(data)) {
                    return data;
                } else {
                    throw new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } });
                }
            }).then(data => {
                return resolve(new ApiResponse({ success: true, extras: { user: data } }));
            }).catch(data => {
                return reject(new Error(data));
            });
    });
};

User.methods.createUser = function () {
    return new Promise((resolve, reject) => {
        this.save().then(data => {
            if (!_.isEmpty(data)) {
                return data;
            } else {
                throw new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } });
            }
        }).then(data => {
            return resolve(new ApiResponse({ success: true, extras: { user: data } }));
        }).catch(data => {
            return reject(new Error(data));
        });
    });
};

User.methods.deleteUser = function (id) {
    return new Promise((resolve, reject) => {
        this.remove({ _id: id }).then(data => {
            if (!_.isEmpty(data)) {
                return data;
            } else {
                throw new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } });
            }
        }).then(data => {
            return resolve(new ApiResponse({ success: true, extras: { user: data } }));
        }).catch(data => {
            return reject(new Error(new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } })));
        });
    });
};

User.methods.readUser = function () {
    return new Promise((resolve, reject) => {
        this.findByUserName(this.username).then((data, err) => {
            if (_.isEmpty(err)) {
                return data;
            } else {
                throw new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } });
            }
        }).then(data => {
            return resolve(new ApiResponse({ success: true, extras: { user: data } }));
        }).catch(data => {
            return reject(new Error(data));
        });
    });
};

User.methods.readAllUsers = function () {
    return new Promise((resolve, reject) => {
        this.model("User").find().then((data, err) => {
            if (_.isEmpty(err)) {
                let users = [];
                _.each(data, user => {
                    users.push(new UserProfile({
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }));
                });
                return data;
            } else {
                throw new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } });
            }
        }).then(data => {
            return resolve(new ApiResponse({ success: true, extras: { userProfileModels: data } }));
        }).catch(data => {
            return reject(new Error(data));
        });
    });
};

User.methods.userIsValid = function (email, password) {
    return new Promise((resolve, reject) => {
        return this.model("User").findOne({ email: email }).then((data, err) => {
            if (!_.isEmpty(err)) {
                throw new ApiResponse({ success: false, extras: { msg: ApiMessages.NOT_FOUND } });
            } else {
                this.salt = data.salt;
                this.password = data.password;
                if (this.passwordMatches(data.password_hash)) {
                    return data;
                } else {
                    throw new ApiResponse({ success: false, extras: { msg: ApiMessages.INVALID_PWD } });
                }
            }
        }).then(data => {
            this.logLogin();
            return resolve(new ApiResponse({ success: true, extras: { user: data } }));
        }).catch(data => {
            return reject(data);
        });
    });
};

User.methods.updateUser = function (userIn) {
    var self = this;
    return new Promise((resolve, reject) => {
        if (!_.isEmpty(userIn)) {

            let updatedUser = {};

            _.forOwn(userIn, (value, key) => {
                updatedUser[key] = value;
            });

            {
                let n = updatedUser.name;
                if (n) {
                    updatedUser['name'] = {};
                    updatedUser['name']['first'] = n.substr(0, n.indexOf(' '));
                    updatedUser['name']['last'] = n.substr(n.indexOf(' ') + 1);
                }
            }

            self.model('User').findOneAndUpdate({ _id: self.id }, updatedUser, { multi: false })
                .exec()
                .then((data, err) => {
                    if (_.isEmpty(err)) {
                        return data;
                    } else {
                        throw new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } });
                    }
                })
                .then(data => {
                    return resolve(new ApiResponse({ success: true, extras: { user: data } }));
                })
                .catch(data => {
                    return reject(new Error(data));
                });
        } else {
            return reject(new Error(new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } })));
        }
    });
};

module.exports = mongoose.model('User', User);