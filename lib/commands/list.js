var Promise = require('bluebird')
  , inquirer = require('inquirer')
  , clc = require('cli-color')
  , config = require('../services/config_manager').load()
  , journal = require('../services/journaler')

var list = exports

list.entries = function() {
  return journal
    .get_entries()
    .then(list.prompt_choices)
    .then(function(choice) { return choice.entry })
    .then(String.prototype.concat.bind(config.journal))
    .then(journal.launch_editor)
    .catch(function(e) {
      console.error(e)
    })
}

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


