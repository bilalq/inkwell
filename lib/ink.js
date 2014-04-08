var ink = require('commander')
  , pjson = require('../package.json')
  , list = require('./commands/list')
  , write = require('./commands/write')
  , open = require('./commands/open')
  , search = require('./commands/search')
  , config = require('./commands/config')

module.exports = function() {
  ink.version(pjson.version)

  ink
    .command('list')
    .description('List all journal entries')
    .action(list.entries)

  ink
    .command('write')
    .description('Write a new journal entry')
    .action(write.entry)

  ink
    .command('open')
    .description('Open last journal entry')
    .action(open.latest)

  ink
    .command('search')
    .description('Search through entries for a pattern')
    .action(search.pattern)

  ink
    .command('config')
    .description('Edit configuration')
    .action(config.manage)

  return ink
}
