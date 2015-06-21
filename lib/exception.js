
/**
 * A Lock Exception class to differentiate lock errors.
 * ----------------------------------------------------
 */
function LockError(message) {
  this.name       = 'LockError';
  this.message    = message || 'LockNegotiationFaile';
}
LockError.prototype             = Object.create(Error.prototype);
LockError.prototype.constructor = LockError;

module.exports    = LockError;
