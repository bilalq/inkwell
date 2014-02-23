var ink = require('commander')
  , clc = require('cli-color')
  , prompt = require('prompt')
  , pjson = require('../package.json')
  , editor = process.env.EDITOR || 'vim'
  , config = require('../config/default')


module.exports = function() {
  ink.version(pjson.version)

  ink
    .command('write')
    .action(function() {
      prompt.message = prompt.delimiter = ''
      prompt.start()
      prompt.get(['name'], function(e, r) { console.log(r) })
    })

  ink 
    .command('config')
    .action(function() {});

  return ink
}
