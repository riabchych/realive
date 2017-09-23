//
//  index.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-09-21.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//
var path = require('path');
global.config = require(path.join(__dirname, '/src/config'));
var app = require(path.join(global.config.paths.src_dir, '/app.js'))();
var http = require('http');
var port = normalizePort(process.env.PORT || '8080');
var logger = require(path.join(global.config.paths.utils_dir, '/logger'));

app.set('port', port);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  logger.info("Server listening on port " + port);
}

var server = http.createServer(app).listen(port);
server.on('listening', onListening);
server.on('error', onError);