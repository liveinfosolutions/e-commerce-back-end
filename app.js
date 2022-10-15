//------------------------IMPORTS-----------------------------------
const app = require('./server');
const debug = require('debug')('node-angular');
const http = require('http');
// ------------------------------------------------------------------



// Method to display the Port address on which server is running
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
  debug('Listening on ' + bind);
};

// Method to Handle valid Port
const normalizePort = val => {
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
};

// Method to handle Error Output
const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
  switch (error.code) {
    case 'EACCES': // If Access is denied
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE': // If Address already in use
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};


// Set the default Port on which server will run
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create Application Server
const server = http.createServer(app);
// Handle the error event
server.on('error', onError);
// Handle the listening event
server.on('listening', onListening);
server.listen(port, () => {
  console.log('Server running on => http://localhost:' + port);
});