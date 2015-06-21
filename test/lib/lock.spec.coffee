crypto          = require 'crypto'
TaskLock        = require '../../lib/lock.js'
LockError       = require '../../lib/exception.js'
START_TIME      = 1433985408000

describe 'Task Lock Functions', ->

  describe '::timestamp', ->

    before -> @clock = sinon.useFakeTimers(START_TIME)

    after -> @clock.restore()

    it 'should return the current time as a millisecond precision timestamp', ->
      actual  = TaskLock.timestamp()
      expect(actual).to.eql START_TIME
