//
//  user-controller.js
//  realive
//
//  Created by Yevheii Riabchych on 2017-09-21.
//  Copyright 2017 Yevheii Riabchych. All rights reserved.
//
var UserController = function (userModel) {

    var crypto = require('crypto'),
        path = require('path'),
        uuid = require('node-uuid'),
        ApiResponse = require(path.join(global.config.paths.config_dir, '/api-response.js')),
        ApiMessages = require(path.join(global.config.paths.config_dir, '/api-messages.js')),
        UserProfile = require(path.join(global.config.paths.models_dir, '/user-profile.js'));

    // TODO: Implement login, logout and changePassword methods. 

    var readAllUsers = function (callback) {

        userModel.find(function (err, users) {

            if (err) {
                return callback(err, new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } }));
            }

            var userProfileModels = [];

            users.forEach(function (user) {
                var userProfileModel = new UserProfile({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                });

                userProfileModels.push(userProfileModel);
            });

            return callback(err, new ApiResponse({ success: true, extras: { userProfileModels: userProfileModels } }));
        });
    };

    var readUser = function (callback) {

        userModel.findByUserName(userModel.username, function (err, user) {
            if (err) {
                return callback(err, new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } }));
            }

            if (user) {

                return callback(err, new ApiResponse({
                    success: true, extras: { user: user }
                }));
            } else {
                return callback(err, new ApiResponse({ success: false, extras: { msg: ApiMessages.NOT_FOUND } }));
            }
        });
    };

    var createUser = function (callback) {

        // TODO: Error if user already exists.
        // TODO: Hash Password.
        userModel.save(function (err, user) {
            if (err) {
                return callback(err, new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } }));
            } else {
                return callback(err, new ApiResponse({ success: true, extras: { user: user} }));
            }
        });
    };

    var mongoose = require("mongoose");

    var updateUser = function (userIn, callback) {
        var updatedUser = {};

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
        }
        mongoose.model('User').findOneAndUpdate(
            // Condition
            { _id: userModel.id },
            // Update
            updatedUser,
            // Options
            { multi: false },
            // Callback
            function (err, numberAffected) {
                return callback(err, numberAffected);
            }
        );
    };

    var deleteUser = function (id, callback) {
        userModel.remove({ _id: id }, function (err, user) {
            callback(err, user);
        });
    };

    var userIsValid = function (email, password, callback) {

        userModel.findByEmail(email, function (err, user) {
            if (err) {
                return callback(err, new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } }));
            }

            if (!user) {
                return callback(err, new ApiResponse({ success: false, extras: { msg: ApiMessages.NOT_FOUND } })); // User not found case
            } else {
                if (encryptPassword(password, user.salt) == user.password_hash) {
                    return callback(err, new ApiResponse({ success: true, extras: { user: user }
                    }));
                } else {
                    return callback(err, new ApiResponse({ success: false, extras: { msg: ApiMessages.INVALID_PWD } })); // Invalid password.
                }
            }
        });
    };

    var encryptPassword = function (password, salt) {
        return crypto.createHmac('sha256', salt).update(password).digest('hex');
    };

    return {
        readAllUsers: readAllUsers,
        readUser: readUser,
        createUser: createUser,
        updateUser: updateUser,
        deleteUser: deleteUser,
        encryptPassword: encryptPassword,
        userIsValid: userIsValid
    };
};

module.exports = UserController;