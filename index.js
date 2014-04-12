var requireService = function(service) {
  return require('./lib/services/' + service)
}

module.exports = {
  config_manager: requireService('config_manager'),
  finder: requireService('finder'),
  humanizer: requireService('humanizer'),
  journaler: requireService('journaler')
}
