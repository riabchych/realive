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
var _ = require('lodash');

class UserController {

    constructor(user) {
        this.userModel = new UserModel(user);
    }

    readAllUsers() {
        var self = this;
        return new Promise((resolve, reject) => {
            if (!_.has(self, 'userModel') || _.isEmpty(self.userModel)) {
                return new Error(new ApiResponse({ success: false, extras: { msg: ApiMessages.INTERNAL_ERROR } }));
            }
            var findUser = data => {
                if (!_.isEmpty(data)) {
                    var users = [];
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
            if (!_.has(self, 'userModel') || _.isEmpty(self.userModel)) {
                return new Error(new ApiResponse({ success: false, extras: { msg: ApiMessages.INTERNAL_ERROR } }));
            }

            var findUser = data => {
                if (!_.isEmpty(data)) {
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

            self.userModel.findByUserName(self.userModel.username).then(findUser).then(userFound).catch(error);
        });
    }

    createUser() {
        var self = this;

        return new Promise((resolve, reject) => {
            if (!_.has(self, 'userModel') || _.isEmpty(self.userModel)) {
                return new Error(new ApiResponse({ success: false, extras: { msg: ApiMessages.INTERNAL_ERROR } }));
            }

            var saveUser = data => {
                if (!_.isEmpty(data)) {
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
            if (!_.has(self, 'userModel') || _.isEmpty(self.userModel)) {
                return new Error(new ApiResponse({ success: false, extras: { msg: ApiMessages.INTERNAL_ERROR } }));
            }

            var updatedUser = {};

            var userFind = data => {
                if (!_.isEmpty(data)) {
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

            if (!_.isEmpty(userIn)) {

                if (_.has(userIn, 'name') && !_.isEmpty(userIn.name)) {
                    userIn.name = _.split(userIn.name, ' ');

                    if (_.isArray(userIn.name) && _.size(userIn.name) > 1) {
                        updatedUser.name = {};
                        updatedUser.name.first = userIn.name[0];
                        updatedUser.name.last = userIn.name[1];
                    }
                }

                if (_.has(userIn, 'website') && !_.isEmpty(userIn.website)) {
                    updatedUser.website = userIn.website;
                }

                if (_.has(userIn, 'about') && !_.isEmpty(userIn.about)) {
                    updatedUser.about = userIn.about;
                }

                if (_.has(userIn, 'username') && !_.isEmpty(userIn.username)) {
                    updatedUser.username = userIn.username;
                }

                if (_.has(userIn, 'email') && !_.isEmpty(userIn.email)) {
                    updatedUser.email = userIn.email;
                }

                if (_.has(userIn, 'location') && !_.isEmpty(userIn.location)) {
                    updatedUser.location = userIn.location;
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

    deleteUser(id) {

        var self = this;

        return new Promise((resolve, reject) => {
            if (!_.has(self, 'userModel') || _.isEmpty(self.userModel)) {
                return new Error(new ApiResponse({ success: false, extras: { msg: ApiMessages.INTERNAL_ERROR } }));
            }
            var userDelete = data => {
                if (!_.isEmpty(data)) {
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
            if (!_.has(self, 'userModel') || _.isEmpty(self.userModel)) {
                return new Error(new ApiResponse({ success: false, extras: { msg: ApiMessages.INTERNAL_ERROR } }));
            }

            var findUser = data => {
                if (_.isEmpty(data)) {
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