//
//  api-message.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

let ApiMessages = {};

ApiMessages.EMAIL_NOT_FOUND = 0;
ApiMessages.INVALID_PWD = 1;
ApiMessages.DB_ERROR = 2;
ApiMessages.NOT_FOUND = 3;
ApiMessages.EMAIL_ALREADY_EXISTS = 4;
ApiMessages.COULD_NOT_CREATE_USER = 5;
ApiMessages.PASSWORD_RESET_EXPIRED = 6;
ApiMessages.PASSWORD_RESET_HASH_MISMATCH = 7;
ApiMessages.PASSWORD_RESET_EMAIL_MISMATCH = 8;
ApiMessages.COULD_NOT_RESET_PASSWORD = 9;
ApiMessages.PASSWORD_CONFIRM_MISMATCH = 10;
ApiMessages.INVALID_USERNAME = 11;
ApiMessages.INTERNAL_ERROR = 12;

export default ApiMessages