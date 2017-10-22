//
//  logoutCtrl.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

import logger from '../utils/logger'

module.exports = (req, res) => {
    req.logout()
    logger.info('Session was destroyed!')
    res.redirect('/')
}
