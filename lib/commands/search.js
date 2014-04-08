var Promise = require('bluebird')
  , inquirer = require('inquirer')
  , _ = require('underscore')
  , find = require('../services/finder')
  , journal = require('../services/journaler')
  , config = require('../services/config_manager').load()


var search = module.exports

search.pattern = function() {
  var pattern = _.initial(arguments).join(' ').trim()
  Promise.all([find.title(pattern), find.text(pattern)])
  .spread(_.union)
  .then(function(entries) {
    if (!entries.length) { throw new Error('No entries') }
    return entries
  })
  .then(search.prompt_results)
  .get('entry')
  .then(journal.resolve_path)
  .then(journal.launch_editor)
  .catch(journal.noEntriesError, function() { console.log('No matching entries found') })
  .error(function(err) { console.error(err.stack) })
}

search.prompt_results = function(entries) {
  return new Promise(function(resolve, reject) {
    inquirer.prompt([{
      type: 'list',
      name: 'entry',
      message: 'Search results:',
      choices: entries
    }], resolve)
  })
}
