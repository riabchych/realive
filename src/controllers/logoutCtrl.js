//
//  logoutCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

var path = require('path');
var logger = require(path.join(global.config.paths.utils_dir, '/logger'));

module.exports = (req, res) => {
    req.logout();
    logger.info('Session was destroyed!');
    res.redirect('/');
};