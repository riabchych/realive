//
//  user-controller.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

var crypto = require('crypto');
var path = require('path');
var uuid = require('node-uuid');
var Promise = require("bluebird");
var mongoose = Promise.promisifyAll(require('mongoose'));
var ApiResponse = require(path.join(global.config.paths.config_dir, '/api-response.js'));
var ApiMessages = require(path.join(global.config.paths.config_dir, '/api-messages.js'));
var UserProfile = require(path.join(global.config.paths.models_dir, '/user-profile.js'));
var UserModel = require(path.join(global.config.paths.models_dir, '/user'));

class UserController {

    constructor(user) {
        this.userModel = new UserModel(user);
    }

    readAllUsers() {
        var self = this;
        return new Promise((resolve, reject) => {

            var findUser = data => {
                if (data) {
                    var users = [];
                    data.forEach(user => {
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
            };

            var userFound = data => {
                return resolve(new ApiResponse({ success: true, extras: { userProfileModels: data } }));
            };

            var error = data => {
                return reject(new Error(data));
            };

            self.userModel.find().then(findUser).then(userFound).catch(error);
        });
    }

    readUser() {
        var self = this;

        return new Promise((resolve, reject) => {

            var findUser = data => {
                if (data) {
                    return data;
                } else {
                    throw new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } });
                }
            };

            var userFound = data => {
                return resolve(new ApiResponse({ success: true, extras: { user: data } }));
            };

            var error = data => {
                return reject(new Error(data));
            };

            self.userModel.findByUserName(userModel.username).then(findUser).then(userFound).catch(error);
        });
    }

    createUser() {
        var self = this;

        return new Promise((resolve, reject) => {

            var saveUser = data => {
                if (data) {
                    return data;
                } else {
                    throw new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } });
                }
            };

            var userSaved = data => {
                return resolve(new ApiResponse({ success: true, extras: { user: data } }));
            };

            var error = data => {
                return reject(new Error(data));
            };

            self.userModel.save().then(saveUser).then(userSaved).catch(error);

        });
    }

    updateUser(userIn) {
        var self = this;

        return new Promise((resolve, reject) => {
            var updatedUser = {};

            var userFind = data => {
                if (data) {
                    return data;
                } else {
                    throw new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } });
                }
            };

            var userUpdated = data => {
                return resolve(new ApiResponse({ success: true, extras: { user: data } }));
            };

            var error = data => {
                return reject(new Error(data));
            };

            if (userIn) {
                if (userIn.name) {
                    userIn.name = userIn.name.split(' ');
                }

                if (userIn.name && userIn.name[0]) {
                    updatedUser.name = {};
                    updatedUser.name.first = userIn.name[0];
                }

                if (userIn.name && userIn.name[1]) {
                    updatedUser.name = updatedUser.name || {};
                    updatedUser.name.last = userIn.name[1];
                }

                if (userIn.website) {
                    updatedUser.website = userIn.website;
                }

                if (userIn.about) {
                    updatedUser.about = userIn.about;
                }

                if (userIn.username) {
                    updatedUser.username = userIn.username;
                }

                if (userIn.email) {
                    updatedUser.email = userIn.email;
                }

                if (userIn.location) {
                    updatedUser.location = userIn.location || null;
                }

                mongoose.model('User')
                    .findOneAndUpdate({ _id: self.userModel.id }, updatedUser, { multi: false })
                    .exec()
                    .then(userFind)
                    .then(userUpdated)
                    .catch(error);
            } else {
                return reject(new Error(new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } })));
            }
        });
    }

    deleteUser() {
        var self = this;

        return new Promise((resolve, reject) => {

            var userDelete = data => {
                if (data) {
                    return data;
                } else {
                    throw new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } });
                }
            };

            var userDeleted = data => {
                return resolve(new ApiResponse({ success: true, extras: { user: data } }));
            };

            var error = () => {
                return reject(new Error(new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } })));
            };

            self.userModel.remove({ _id: id }).then(userDelete).then(userDeleted).catch(error);
        });
    }

    userIsValid(email, password) {
        var self = this;

        return new Promise((resolve, reject) => {
            var findUser = data => {
                if (!data) {
                    throw new ApiResponse({ success: false, extras: { msg: ApiMessages.NOT_FOUND } });
                } else {
                    if (self.encryptPassword(password, data.salt) == data.password_hash) {
                        return data;
                    } else {
                        throw new ApiResponse({ success: false, extras: { msg: ApiMessages.INVALID_PWD } });
                    }
                }
            };

            var isValid = data => {
                self.userModel = new UserModel(data);
                self.logLogin();
                return resolve(new ApiResponse({ success: true, extras: { user: data } }));
            };

            var error = data => {
                return reject(data);
            };

            self.userModel.findByEmail(email).then(findUser).then(isValid).catch(error);
        });
    }

    logLogin() {
        this.userModel.last_login = Date.now();
        this.userModel.save();
    }

    encryptPassword(password, salt) {
        return crypto.createHmac('sha256', salt).update(password).digest('hex');
    }
};

module.exports = UserController;