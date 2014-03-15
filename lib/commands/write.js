var Promise = require('bluebird')
  , promptly = Promise.promisifyAll(require('promptly'))
  , clc = require('cli-color')
  , journal = require('../services/journaler')

var write = exports

/**
 * Entry point of write command
 */
write.entry = function() {
  return write.prompt_for_name()
  .then(journal.add_entry)
  .get('entry')
  .then(journal.launch_editor)
  .catch(write.error_handler)
}

/**
 * Prompts user for entry name
 */
write.prompt_for_name = function() {
  return promptly.promptAsync(clc.cyan('Name:'), {default: ''})
}


/**
 * Final error handler of write command
 */
write.error_handler = function(err) {
  console.error('Failed to write to journal:', err)
}
