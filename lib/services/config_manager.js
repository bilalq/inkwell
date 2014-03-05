var fs = require('fs')
  , _ = require('underscore')
  , custom_config_path = __dirname + '/../../config/custom.json'

var config = exports
  , config_cache


/**
 * Fields that can be configured
 */
config.fields = ['filetype', 'journal', 'editor']


/**
 * Loads and returns config data
 */
config.load = function() {
  if (config_cache) { return config_cache }

  var defaults = require('../../config/default')
    , overrides = {}

  try {
    overrides = JSON.parse(fs.readFileSync(custom_config_path))
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.error('Invalid JSON in config: ', e.message)
    }
  }
  config_cache = _.defaults(overrides, defaults)
  return config_cache
}


/**
 * Delete custom config data and revert to defaults
 */
config.restore_defaults = function() {
  config.clear_cache()
  try {
    return fs.unlinkSync(custom_config_path)
  } catch (e) {
    if (e.code === 'ENOENT') { return }
    console.error('Unable to restore_defaults', e.message)
  }
}


/**
 * Save custom config
 */
config.save = function(settings) {
  config.clear_cache()
  settings = _.pick.apply(_, [settings].concat(config.fields))
  try {
    fs.writeFileSync(custom_config_path, JSON.stringify(settings, null, 2))
  } catch (e) {
    console.error('Unable to save config: ', e.message)
  }
}


/**
 * Clears the config cache
 */
config.clear_cache = function() {
  config_cache = null
}
