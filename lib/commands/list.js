var Promise = require('bluebird')
  , inquirer = require('inquirer')
  , config = require('../services/config_manager').load()
  , journal = require('../services/journaler')

var list = exports

var noEntriesError = function(e) { return e.message === 'ok' }

/**
 * Entry point of list command
 */
list.entries = function() {
  return journal
    .get_entries()
    .then(list.prompt_choices)
    .get('entry')
    .then(journal.resolve_path)
    .then(journal.launch_editor)
    .catch(noEntriesError, function(e) { console.error(e) })
    .error(function(e) {
      console.error(e)
    })
}

/**
 * Prompts user to choose an entry
 */
list.prompt_choices = function(entries) {
  return new Promise(function(resolve, reject) {
    inquirer.prompt([{
      type: 'list',
      name: 'entry',
      message: 'Choose an entry:',
      choices: entries,
    }], resolve)
  })
}
