//
//  routes.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

import express from 'express'
import isLoggedIn from './utils/isLoggedIn.js'
import homeCtrl from './controllers/homeCtrl'
import loginCtrl from './controllers/loginCtrl'
import signupCtrl from './controllers/signupCtrl'
import editCtrl from './controllers/editCtrl'
import profileCtrl from './controllers/profileCtrl'
import emailCtrl from './controllers/emailCtrl'
import logoutCtrl from './controllers/logoutCtrl'
import reviewCtrl from './controllers/reviewCtrl'

const router = express.Router();

// Basic routes
router.get('/', homeCtrl);
router.get('/login', loginCtrl);
router.get('/signup', signupCtrl);

// Auth controllers
router.post('/login', loginCtrl);
router.post('/signup', signupCtrl);

// Only for registred users
router.get('/user/edit', isLoggedIn, editCtrl);
router.post('/user/edit/personally', isLoggedIn, editCtrl);
//router.post('/user/edit/email', isLoggedIn, users.edit.personally);
//router.post('/user/edit/username', isLoggedIn, users.edit.personally);
router.get('/user/logout', isLoggedIn, logoutCtrl);

router.get('/user/:username', profileCtrl);
router.get('/user/email/:action/:token', emailCtrl);

// Review controllers
//router.post('/review/:action', reviewCtrl);
//router.post('/review/get/:review', isLoggedIn, reviewCtrl);
//router.post('/review/list', isLoggedIn, reviewCtrl);

export default router;