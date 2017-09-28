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
    app.get('/', controllers.homeCtrl);
    app.get('/login', controllers.loginCtrl);
    app.get('/signup', controllers.signupCtrl);
    
    // Auth controllers
    app.post('/login', controllers.loginCtrl);
    app.post('/signup', controllers.signupCtrl);
    
    // Only for registred users
    app.get('/user/edit', mustAuthenticatedMw, controllers.editCtrl);
    app.post('/user/edit/personally', mustAuthenticatedMw, controllers.editCtrl);
    //app.post('/user/edit/email', mustAuthenticatedMw, controllers.users.edit.personally);
    //app.post('/user/edit/username', mustAuthenticatedMw, controllers.users.edit.personally);
    app.get('/user/logout', mustAuthenticatedMw, controllers.logoutCtrl);

    app.get('/user/:username', controllers.profileCtrl);

    // Review controllers
    app.post('/review/:action', controllers.reviewCtrl);
    //app.post('/review/get/:review', mustAuthenticatedMw, controllers.reviewCtrl);
    //app.post('/review/list', mustAuthenticatedMw, controllers.reviewCtrl);
};