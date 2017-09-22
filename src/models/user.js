//
//  user.js
//  realive
//
//  Created by Yevheii Riabchych on 2017-09-21.
//  Copyright 2017 Yevheii Riabchych. All rights reserved.
//
(function () {
    
    var crypto = require('crypto');
    var mongoose = require("mongoose");
    
    /**
     * Model: User
     */
    function validatePresenceOf(value) {
        return value && value.length;
    }
    var User = new mongoose.Schema({
        'name': {
            'first': {
                type: String,
                required: true,
                trim: true

            },
            'last': {
                type: String,
                required: true,
                trim: true

            },
        },
        'birthday': {
            type: Date,
            default: Date.now
        },
        'sex': {
            type: String
        },
        'photo': {
            type: String,
            default: 'no-avatar.gif'
        }, 
        'about': {
            type: String,
            trim: true
        },
        'website': {
            type: String,
            trim: true
        },
        'location': {
            type: String,
            validate: /[a-z]/
        },
        'username': {
            type: String,
            minLength: 3,
            maxLength: 12,
            index: {
                unique: true
            },
            trim: true
        },
        'email': {
            type: String,
            validate: [validatePresenceOf, 'an email is required'],
            trim: true,
            index: {
                unique: true
            },
            lowercase: true,
            required: true
        },
        'registered': {
            type: Date,
            default: Date.now
        },
        'last_login': {
            type: Date,
            default: Date.now
        },
        'password_hash': {
            type: String,
            default: null
        },
        'status': {
            type: String,
            default: 'invalid',
            enum: ['valid', 'invalid']
        },
        'salt': String,
    });
    
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
        var password_hash = this.encryptPassword(password);
        if (this.password_hash == password_hash) {
            return true;
        }
        return false;
    });
    
    User.method('findByUserName', function (username, callback) {
        return this.model("User").findOne({ username: username }, callback);
    });
    
    User.methods.findByEmail = function (email, callback) {
        return this.model("User").findOne({ email: email }, callback);
    };
    
    User.virtual('name.full')
        .get(function () {
        return this.name.first + ' ' + this.name.last;
    });
    
    User.path("email")
        .validate(function (email) {
        return email && !!email.match(/^.+\@.+/);
    });
    
    User.method('logLogin', function () {
        this.last_login = new Date();
        this.save(function (err, user) {
            if (err) {
                console.log('ERROR: Unable to logLogin. Unable to save: ', err);
            }
        });
    });
    
    User.method('toJSON', function () {
        var obj = this.toObject();
        delete obj.password_hash;
        return obj;
    });
    
    User.pre('save', function (next) {
        if (!validatePresenceOf(this.password)) {
            next(new Error('Invalid password'));
        }
        else {
            if (this.isNew) {
                this.username = this.makeSalt();
            }
            next();
        }

    });
    
    module.exports = mongoose.model('User', User);

}).call(this);