/**
 * A locking mechanism designed for the UOW Queue.
 * -----------------------------------------------
 */
var crypto                = require('crypto');
var LockError             = require('../lib/exception.js');
var DEFAULT_TIME_TO_LIVE  = 30000; // 30 seconds

/**
 * Return the number of milliseconds since the Unix epoch.
 * -------------------------------------------------------
 * @return {int}
 * @api {private}
 */
function timestamp() {
  return new Date().getTime();
}

/**
 * Generate a unique hash from the given requestor and task identifiers.
 * ---------------------------------------------------------------------
 * @param {string} requestorId
 * @param {string} taskId
 * @return {string}
 * @api {private}
 */
function hashKey(requestorId, taskId) {
  var sha       = crypto.createHash('sha512');
  sha.update(requestorId);
  sha.update(taskId);

  return sha.digest('hex');
}

/**
 * Is the given task locked?
 * -------------------------
 * @param {Task} task
 * @return {bool}
 * @throws {TypeError}
 */
function isTaskLocked(task) {
  if(task.semaphore) {
    if(!task.semaphore.ttl) {
      throw new TypeError('TimeToLiveNotPresent');
    }
    return ( (timestamp() - task.semaphore.time) < task.semaphore.ttl );
  }
  return false;
}

/**
 * Does the given ID refer to the current lock holder?
 * ---------------------------------------------------
 * @param {Task} task
 * @param {string} requestorId
 * @return {bool}
 * @throws {LockError}
 * @api {public}
 */
function isLockHolder(task, requestorId) {
  if(!task.semaphore) {
    throw new LockError('TaskNotLocked');
  }
  var requestKey  = hashKey(requestorId, task.id);

  return requestKey === task.semaphore.key;
}

/**
 * Acquire a lock against a task.
 * ------------------------------
 * @param {int} timeToLive
 * @param {string} requestorId
 * @param {Task} task
 * @return {Task}
 * @throws {TypeError}
 * @throws {LockError}
 * @api {public}
 */
function acquire(timeToLive, requestorId, task) {
  timeToLive    = timeToLive || DEFAULT_TIME_TO_LIVE;

  if(!requestorId) {
    throw new TypeError('RequestorIdNotPresent');
  }
  if(!task) {
    throw new TypeError('TaskNotFound');
  }
  if(isTaskLocked(task)) {
    if(isLockHolder(task, requestorId)) {

      task.semaphore.time  = timestamp();

      return task;
    }

    throw new LockError('TaskAlreadyLocked');
  }

  task.semaphore  = {
    key:          hashKey(requestorId, task.id),
    time:         timestamp(),
    ttl:          timeToLive
  };

  return task;
}

/**
 * Release the lock from the given task.
 * -------------------------------------
 * @param {string} requestorId
 * @param {Task} task
 * @return {Task}
 * @throws {TypeError}
 * @throws {LockError}
 * @api {public}
 */
function release(requestorId, task) {
  if(!requestorId) {
    throw new TypeError('RequestorIdNotPresent');
  }
  if(!task) {
    throw new TypeError('TaskNotPresent');
  }

  var semaphore   = task.semaphore;

  // Task isn't locked, it's already released.
  if(!semaphore) {
    return task;
  }

  var key         = hashKey(requestorId, task.id);

  if(semaphore.key !== key) {
    throw new LockError('KeyInvalid');
  }

  task.semaphore  = null;

  return task;
}

module.exports  = {
  acquire:      acquire,
  release:      release,
  isTaskLocked: isTaskLocked,
  isLockHolder: isLockHolder,
  timestamp:    timestamp
};
