// Test helpers
global.sinon = require('sinon')
global.chai = require('chai')
global.should = require('chai').should()
global.expect = require('chai').expect
global.AssertionError = require('chai').AssertionError
global.chai.use(require('sinon-chai'))
global.chai.use(require('chai-fs'))
global.chai.use(require('chai-as-promised'))

// Polyfills
if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (searchString, position) {
      position = position || 0
      return this.indexOf(searchString, position) === position
    }
  })
}
if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, 'endsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (searchString, position) {
      position = position || this.length
      position = position - searchString.length
      var lastIndex = this.lastIndexOf(searchString)
      return lastIndex !== -1 && lastIndex === position
    }
  })
}

global.requireService = function(service) {
  return require('../lib/services/' + service)
}

global.requireCommand = function(command) {
  return require('../lib/commands/' + command)
}
