//
//  user-schema.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-24.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
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

        }
    },
    'birthday': {
        type: Date,
        default: Date.now
    },
    'sex': {
        type: Boolean
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
    'verify_code': {
        type: String,
        default: null
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
    'meta': {
        'numberOfReviews': {
            type: Number,
            default: 0
        },
        'numberOfFollowers': {
            type: Number,
            default: 0
        },
        'numberOfSubscriptions': {
            type: Number,
            default: 0
        }
    },
    'salt': String
})
