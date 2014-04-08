var Promise = require('bluebird')
  , grep = require('grep1')
  , journal = require('./journaler')
  , config = require('./config_manager').load()

var find = module.exports

grep.configure({
  execOptions: {cwd: config.journal}
})

find.match_checker = function(term) {
  term = term.trim()
  if (/^\/.+\/$/.test(term)) {
    var regex = new RegExp(term.substring(1, term.length - 1))
    return regex.test.bind(regex)
  } else {
    term = term.toLowerCase()
    return function(entry) {
      return entry.toLowerCase().indexOf(term) >= 0
    }
  }
}

find.title = function(term) {
  return journal.get_entries()
  .filter(find.match_checker(term))
  .catch(journal.noEntriesError, function() { return [] })
}

find.text = function(term) {
  return new Promise(function(resolve, reject) {
    grep(['-i', '-l', '-r', term, '.'], function(err, stdout, stderr) {
      if (err) { return reject(err) }
      resolve(stdout.trim().split('\n'))
    })
  })
  .map(function(entry) { return entry.slice(2) })
  .then(journal.filter_entries)
  .error(function() { return [] })
}
