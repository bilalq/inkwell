var path = require('path')

module.exports = {
  filetype: 'md',
  journal: path.resolve(__dirname + '/../journal'),
  editor: process.env.EDITOR || 'vim'
}
