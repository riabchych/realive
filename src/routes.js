//
//  routes.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

let path = require('path');
let requireTree = require('require-tree');
let isLoggedIn = require(path.join(global.config.paths.utils_dir, '/isLoggedIn.js'));
let controllers = requireTree(global.config.paths.controllers_dir);
let router = require('express').Router();

// Basic routes
router.get('/', controllers.homeCtrl);
router.get('/test', controllers.testCtrl);
router.get('/login', controllers.loginCtrl);
router.get('/signup', controllers.signupCtrl);

// Auth controllers
router.post('/login', controllers.loginCtrl);
router.post('/signup', controllers.signupCtrl);

// Only for registred users
router.get('/user/edit', isLoggedIn, controllers.editCtrl);
router.post('/user/edit/personally', isLoggedIn, controllers.editCtrl);
//router.post('/user/edit/email', isLoggedIn, controllers.users.edit.personally);
//router.post('/user/edit/username', isLoggedIn, controllers.users.edit.personally);
router.get('/user/logout', isLoggedIn, controllers.logoutCtrl);

router.get('/user/:username', controllers.profileCtrl);
router.get('/user/email/:action/:token', controllers.emailCtrl);

// Review controllers
router.post('/review/:action', controllers.reviewCtrl);
//router.post('/review/get/:review', isLoggedIn, controllers.reviewCtrl);
//router.post('/review/list', isLoggedIn, controllers.reviewCtrl);

module.exports = router;