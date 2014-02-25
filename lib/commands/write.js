var Promise = require('bluebird')
  , promptly = Promise.promisifyAll(require('promptly'))
  , clc = require('cli-color')
  , config = require('../services/config_manager').load()
  , journal = require('../services/journaler')

var write = exports

write.entry = function() {
  return write
    .prompt_for_name()
    .then(journal.add_entry)
    .then(journal.launch_editor)
    .catch(write.error_handler)
}

write.prompt_for_name = function() {
  return promptly.promptAsync(clc.cyan('Name:'), {default: ''})
}

write.error_handler = function(err) {
  console.error('Failed to write to journal:', err)
}
