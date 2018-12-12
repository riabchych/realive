//
//  logoutCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict';

import logger from '../utils/logger'

export default (req, res) => {
    req.logout();
    res.redirect('/');
    logger.info('Session was destroyed!')
}