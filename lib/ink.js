var ink = require('commander')
  , pjson = require('../package.json')
  , write = require('./commands/write')
  , open = require('./commands/open')
  , list = require('./commands/list')
  , config = require('./commands/config')

module.exports = function() {
  ink.version(pjson.version)

  ink
    .command('write')
    .description('Write a new journal entry')
    .action(write.prompt_name)

  ink
    .command('open')
    .description('Open last journal entry')
    .action(open)

  ink
    .command('list')
    .description('List all journal entries')
    .action(list)

  ink
    .command('config')
    .description('Edit configuration')
    .action(config)

  return ink
}
