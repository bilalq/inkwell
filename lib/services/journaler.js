var Promise = require('bluebird')
  , fs = Promise.promisifyAll(require('fs'))
  , humanize = require('../services/humanizer')
  , config = require('./config_manager').load()
  , spawn = require('child_process').spawn
  , safe_append_flag = { flag: 'wx' }

var journal = exports

journal.boilerplate = function(name) {
  if (!name) { return '' }
  return name.concat('\n', name.replace(/./g, '='), '\n')
}

journal.add_entry = function(name) {
  var file_name = config.journal.concat(humanize.date(), name)
  return file_name
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
