var Promise = require('bluebird')
  , journal = require('../services/journaler')
  , _ = require('underscore')
  , config = require('../services/config_manager').load()

var open = exports

/**
 * Entry point of open command
 */
open.latest = function() {
  return journal.get_last_modified()
  .then(journal.launch_editor)
  .catch(journal.noEntriesError, open.error_handler)
  .error(console.error)
}

/**
 * Error handler for when no entries are found
 */
open.error_handler = function() {
  console.error('No entries found in journal')
}
