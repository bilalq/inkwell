var Promise = require('bluebird')
  , _ = require('underscore')
  , fs = Promise.promisifyAll(require('fs'))
  , spawn = require('child_process').spawn
  , humanize = require('../services/humanizer')
  , config = require('./config_manager').load()
  , safe_append_flag = { flag: 'wx' }

var journal = exports

/**
 * Error predicate for noEntriesError
 *
 * @param {Error} e
 * @returns {Boolean}
 */
journal.noEntriesError = function(e) {
  return e.message === 'No entries'
}

/**
 * Generates boilerplate for markdown entries
 *
 * @returns {String}
 */
journal.boilerplate = function(name) {
  if (!name) { return '' }
  if (config.filetype !== 'md') { return '' }
  return name.concat('\n', name.replace(/./g, '='), '\n')
}

/**
 * Adds new entry to file system. If it already exists, this just returns it.
 *
 * @param {String} name
 * @returns {Promise<Object>}
 */
journal.add_entry = function(name) {
  var file_name = humanize.date().concat(name || 'Untitled', '.', config.filetype)
    , path_name = config.journal.concat('/', file_name)

  return fs.writeFileAsync(
    path_name,
    journal.boilerplate(name),
    safe_append_flag
  ).return({ entry: file_name })
  .error(function(e) {
    if (e.cause.code === 'EEXIST') {
      console.warn('Entry with this name already exists. Opening existing entry...')
      return { entry: file_name }
    }
    throw e
  })
}

/**
 * Launches a text editor with the passed in file
 *
 * @param {String} file Name of the file
 * @returns {Promise}
 */
journal.launch_editor = function(file) {
  var editor = spawn(config.editor, [file], {stdio: 'inherit'})
    , on = Promise.promisify(editor.on, editor)
  return on('exit')
}

/**
 * Gets the list of all journal entries
 *
 * @returns {Promise<String[]>}
 */
journal.get_entries = function() {
  return fs.readdirAsync(config.journal).then(journal.filter_entries)
  .then(function(entries) {
    if (!entries.length) { throw new Error('No entries') }
    return entries
  })
}

/**
 * Given a journal entry name, returns the full path to the entry
 *
 * @param {String} entry
 * @returns {Promise<String>}
 */
journal.resolve_path = function(entry) {
  return Promise.resolve(config.journal.concat('/', entry))
}

/**
 * Filters out common hidden files and swap files
 *
 * @param {String[]} files
 * @returns {Promise<String[]>}
 */
journal.filter_entries = function(files) {
  var ignored_files = ['.gitignore', '.DS_Store', 'Thumbs.db', '.ctags',
    '.Trashes', '.Spotlight-V100', '.editorconfig']
  files = _.difference(files, ignored_files)
  files = _.reject(files, RegExp.prototype.test.bind(/^(.+\.sw.?|4913)$/))
  return Promise.resolve(files)
}

/**
 * Returns the name of the last modified journal entry
 *
 * @returns {Promise<String>}
 */
journal.get_last_modified = function() {
  return journal.get_entries()
  .map(journal.resolve_path)
  .reduce(function(latest, file) {
    return fs.statAsync(file).then(function(stat) {
      stat.file_name = file
      return _.max([stat, latest], function(file) { return file.mtime })
    })
  }, { mtime: new Date(0) })
  .get('file_name')
}
