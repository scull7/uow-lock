
LockError = require '../lib/exception.js'
TaskLock  = require '../index.js'

describe 'TaskLock Module', ->

  it 'should allow access to the lock error module.', ->
    expect(TaskLock.LockError).to.be.eql LockError

  describe '::acquire', ->

    it 'should be a function with an arity of 3', ->
      expect(TaskLock.acquire).to.be.a 'function'
      expect(TaskLock.acquire.length).to.eql 3


  describe '::release', ->

    it 'should be a function with an arity of 2', ->
      expect(TaskLock.release).to.be.a 'function'
      expect(TaskLock.release.length).to.eql 2

  describe '::isTaskLocked', ->

    it 'should be a function with an arity of 1', ->
      expect(TaskLock.isTaskLocked).to.be.a 'function'
      expect(TaskLock.isTaskLocked.length).to.eql 1

  describe '::isLockHolder', ->

    it 'should be a function with an arity of 2', ->
      expect(TaskLock.isLockHolder).to.be.a 'function'
      expect(TaskLock.isLockHolder.length).to.eql 2

  describe '::timestamp', ->

    it 'should be a function with an arity of 0', ->
      expect(TaskLock.timestamp).to.be.a 'function'
      expect(TaskLock.timestamp.length).to.eql 0
