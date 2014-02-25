var Promise = require('bluebird')
  , fs = Promise.promisifyAll(require('fs'))
  , _ = require('underscore')
  , spawn = require('child_process').spawn
  , config = require('./config_manager').load()
  , humanize = require('../services/humanizer')
  , safe_append_flag = { flag: 'wx' }

var journal = exports


journal.boilerplate = function(name) {
  if (!name) { return '' }
  return name.concat('\n', name.replace(/./g, '='), '\n')
}


journal.add_entry = function(name) {
  var file_name = config.journal.concat(
    humanize.date(), name || 'Untitled', '.', config.filetype
  )
  return fs.writeFileAsync(
    file_name,
    journal.boilerplate(name),
    safe_append_flag
  ).return(file_name)
  .error(function(e) {
    if (e.cause.code === 'EEXIST') { return file_name }
    throw e
  })
}


journal.launch_editor = function(file) {
  return new Promise(function(resolve, reject) {
    var editor = spawn(config.editor, [file], {stdio: 'inherit'});
    editor.on('exit', function(err, res) {
      if (err) { reject(err) }
      resolve(res)
    })
  })
}


journal.get_entries = function() {
  return fs.readdirAsync(config.journal).then(journal.filter_entries)
}


journal.filter_entries = function(files) {
  return new Promise(function(resolve, reject) {
    var ignored_files = ['.gitignore', '.DS_Store', 'Thumbs.db', '.ctags',
      '.Trashes', '.Spotlight-V100']
    files = _.difference(files, ignored_files)
    files = _.reject(files, RegExp.prototype.test.bind(/^(.+\.sw.?|4913)$/))
    resolve(files)
  })
}

