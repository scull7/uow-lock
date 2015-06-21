var Lock        = require('./lib/lock.js');
var LockError   = require('./lib/exception.js');

Lock.LockError  = LockError;

module.exports  = Lock;
