var Promise = require('bluebird')
  , journal = require('../services/journaler')
  , _ = require('underscore')
  , config = require('../services/config_manager').load()

var open = exports

open.latest = function() {
  return journal.get_last_modified()
  .then(journal.launch_editor)
  .catch(journal.noEntriesError, open.error_handler)
  .error(console.error)
}

open.error_handler = function() {
  console.error('No entries found in journal')
}
