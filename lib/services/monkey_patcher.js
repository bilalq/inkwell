var readline = require('readline')

exports.patch = function() {
  // From: https://github.com/flatiron/prompt/blob/master/lib/prompt.js
  //
  // Monkey-punch readline.Interface to work-around
  // https://github.com/joyent/node/issues/3860
  //
  readline.Interface.prototype.setPrompt = function(prompt, length) {
    this._prompt = prompt
    if (length) {
      this._promptLength = length
    } else {
      var lines = prompt.split(/[\r\n]/)
      var lastLine = lines[lines.length - 1]
      this._promptLength = lastLine.replace(/\u001b\[(\d+(;\d+)*)?m/g, '').length
    }
  }
}
