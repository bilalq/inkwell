var Promise = require('bluebird')
  , clc = require('cli-color')
  , inquirer = require('inquirer')
  , _ = require('underscore')
  , config_manager = require('../services/config_manager')

var config = exports

/**
 * Entry point of config command
 */
config.manage = function() {
  return config.prompt_action()
  .get('entry')
  .then(config.route_action)
  .error(config.handle_errors)
}

/**
 * Prompts user for course of action
 */
config.prompt_action = function() {
  return new Promise(function(resolve, reject) {
    inquirer.prompt([{
      type: 'list',
      name: 'entry',
      message: 'Config:',
      choices: ['show', 'change', 'restore defaults']
    }], resolve)
  })
}

/**
 * Based on the chosen action, routes to the appropriate config function
 */
config.route_action = function(action) {
  console.log(action)
  switch (action) {
    case 'show': return config.show()
    case 'change': return config.change()
    case 'restore defaults': return config.restore_defaults()
    case 'default': throw new Error('Invalid config route:' + action)
  }
}

/**
 * Restores configuration to default settings
 */
config.restore_defaults = function() {
  config_manager.restore_defaults()
  config.show()
}

/**
 * Handles configuration updates
 */
config.change = function() {
  var prompts = _.map(config_manager.load(), function(val, key) {
    return { name: key, message: key, default: val }
  })

  return new Promise(function(resolve) {
    inquirer.prompt(prompts, resolve)
  })
  .then(config_manager.save)
  .then(config.show)
  .error(config.handle_errors)
}

/**
 * Pretty prints current configuraiton settings
 */
config.show = function() {
  _.each(config_manager.load(), function(val, key) {
    console.log(clc.cyan(key + ": ") + val)
  })
}

/**
 * Final error handler for config command
 */
config.handle_errors = function(e) {
  console.error(e)
}
