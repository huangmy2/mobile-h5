#!/usr/bin/env node
const debug = require('debug')('demo:server');
const http = require('http');
const logger = require('./lib/logger');
require('events').EventEmitter.defaultMaxListeners = 25;

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || 8080);
const env = process.env.NODE_ENV || app.env;
if (env == 'production') {
  const app = require('./app');
  var server = http.createServer(app.callback());
  let msg = `Worker: ${process.pid} is running.`;
  logger.app.info(msg);
    /** Listen on provided port, on all network interfaces.**/
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
} else {
  const dev_app = require('./build/dev-server.js');
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  const port = parseInt(val, 10);
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

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    logger.app.error(error);
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
  case 'EADDRINUSE':
    console.error(bind + ' is already in use');
    process.exit(1);
    break;
  default:
    logger.app.error(error);
    throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
