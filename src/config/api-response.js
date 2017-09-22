//
//  api-response.js
//  realive
//
//  Created by Yevheii Riabchych on 2017-09-21.
//  Copyright 2017 Yevheii Riabchych. All rights reserved.
//
var ApiResponse = module.exports = function (cnf) {
    this.success = cnf.success;
    this.extras = cnf.extras;
};