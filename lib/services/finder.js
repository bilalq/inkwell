var Promise = require('bluebird')
  , grep = require('grep1')
  , journal = require('./journaler')
  , config = require('./config_manager').load()

var find = module.exports

/**
 * Configure grep function to use journal root as cwd
 */
grep.configure({
  execOptions: {cwd: config.journal}
})

/**
 * Takes in a search term and returns a function that tests for matches. A
 * RegExp string will be converted to an actual RegExp.
 *
 * @param {String} term
 * @return {Function}
 */
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

/**
 * Search for matches among journal titles
 *
 * @param {String} term
 * @return {Promise<String[]>}
 */
find.title = function(term) {
  return journal.get_entries()
  .filter(find.match_checker(term))
  .catch(journal.noEntriesError, function() { return [] })
}

/**
 * Search for matches among text in journal entries
 *
 * @param {String} term
 * @return {Promise<String[]>}
 */
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
