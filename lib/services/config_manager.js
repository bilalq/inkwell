var fs = require('fs')
  , _ = require('underscore')
  , custom_config_path = '../../config/custom.json'


/**
 * Load config data and return promise that yields it.
 */
exports.load = function() {
  var defaults = require('../../config/default')
    , overrides = {}
  try {
    overrides = JSON.parse(fs.readFileSync(custom_config_path))
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.error('Invalid JSON in config: ', e.message)
    }
  } finally {
    return _.defaults(overrides, defaults)
  }
}


/**
 * Delete custom config data and revert to defaults
 */
exports.restore_defaults = function() {
  return fs.unlinkSync(custom_config_path)
}


/**
 * Save custom config
 */
exports.save = function(settings) {
  try {
    fs.writeFileSync(custom_config_path, JSON.stringify(settings, null, 2))
  } catch (e) {
    console.error('Unable to save config: ', e.message)
  }
}
