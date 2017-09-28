//
//  review-schema.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-25.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toReview: { type: mongoose.Schema.Types.ObjectId, ref: 'Review'},
    body: { type: String, trim: true },
    isPrivate: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    unread: { type: Boolean, default: false },
    meta: {
        numberOfLikes: { Number, default: 0 },
        numberOfComments: { Number, default: 0 }
    }
});;