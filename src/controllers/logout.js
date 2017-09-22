//
//  logout.js
//  realive
//
//  Created by Yevheii Riabchych on 2017-09-21.
//  Copyright 2017 Yevheii Riabchych. All rights reserved.
//
(function () {
    var path = require('path');
    var logger = require(path.join(global.config.paths.utils_dir, '/logger'));
    
     module.exports = function(req, res) {
        req.session.destroy()
        req.logout()
        logger.info('Session was destroyed!');
		res.redirect('/')
     };

 }).call(this);