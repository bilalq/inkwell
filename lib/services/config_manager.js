var fs = require('fs')
  , _ = require('underscore')
  , defaults = require('../../config/default')

var config = exports
  , custom_config_path = __dirname + '/../../config/custom.json'
  , config_cache

/**
 * Recognize configurable fields by reading keys from default config
 */
config.fields = _.keys(defaults)

/**
 * Loads and returns config data
 *
 * @returns {Object}
 */
config.load = function() {
  if (config_cache) { return config_cache }
  var overrides = {}
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
 * Deletes custom config data and revert to defaults
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
 * Saves custom config
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
