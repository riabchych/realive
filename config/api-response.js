//
//  api-response.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//
var ApiResponse = module.exports = function (cnf) {
    this.success = cnf.success;
    this.extras = cnf.extras;
};