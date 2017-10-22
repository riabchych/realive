//
//  redis-store.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-29.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

let path = require('path');
let RedisStore = global.config.session.useStore ? require('connect-redis')(expressSession) : null;

module.exports = RedisStore ? new RedisStore({
    host: global.config.session.storeHost,
    port: global.config.session.storePort,
    ttl: global.config.session.storeTTL
}) : null;