//
//  routes.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//
var path = require('path');
var requireTree = require('require-tree');
var mustAuthenticatedMw = require(path.join(global.config.paths.utils_dir, '/mustAuthenticatedMw.js'));
var controllers = requireTree(global.config.paths.controllers_dir);

module.exports.set = app => {
    
    // Basic routes
    app.get('/', controllers.home);
    app.get('/login', controllers.login);
    app.get('/signup', controllers.signup);
    
    // Auth controllers
    app.post('/login', controllers.login);
    app.post('/signup', controllers.signup);
    
    // Only for registred users
    app.get('/user/edit', mustAuthenticatedMw, controllers.edit);
    app.post('/user/edit/personally', mustAuthenticatedMw, controllers.edit);
    //app.post('/user/edit/email', mustAuthenticatedMw, controllers.users.edit.personally);
    //app.post('/user/edit/username', mustAuthenticatedMw, controllers.users.edit.personally);
    app.get('/user/logout', mustAuthenticatedMw, controllers.logout);

    app.get('/user/:username', controllers.profile);
};