var padZeroes = function(val) {
  return ('0' + val).slice(-2)
}

exports.date = function(date) {
  date = date || new Date();
  return [
    date.getFullYear(),
    padZeroes(date.getMonth() + 1),
    padZeroes(date.getDate())
  ].join('-') + '-'
}
