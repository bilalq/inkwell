var Promise = require('bluebird')
  , promptly = Promise.promisifyAll(require('promptly'))
  , inquirer = require('inquirer')
  , clc = require('cli-color')
  , journal = require('../services/journaler')
  , config = require('../services/config_manager').load()

var list = exports

/**
 * Entry point of list command
 */
list.entries = function() {
  return journal.get_entries()
  .catch(journal.noEntriesError, function() { return [] })
  .then(list.prompt_choices)
  .then(list.prompt_for_new_entry)
  .get('entry')
  .then(journal.resolve_path)
  .then(journal.launch_editor)
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
      message: 'Choose an entry to edit:',
      choices: ['[New entry]'].concat(entries),
    }], resolve)
  })
}

/**
 * Prompts user for entry name
 */
list.prompt_for_new_entry = function(choice) {
  if (choice.entry !== '[New entry]') { return choice }
  return promptly.promptAsync(clc.cyan('Name:'), {default: ''})
  .then(journal.add_entry)
}
