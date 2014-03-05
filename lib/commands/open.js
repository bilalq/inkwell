var Promise = require('bluebird')
  , journal = require('../services/journaler')
  , _ = require('underscore')
  , config = require('../services/config_manager').load()

var open = exports

open.latest = function() {
  return journal
    .get_last_modified()
    .then(journal.launch_editor)
    .catch(TypeError, function(e) { console.log('No entries found in journal') })
    .error(open.error_handler)
}

open.error_handler = function(e) {
  console.error(e)
}
