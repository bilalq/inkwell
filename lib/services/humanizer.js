/**
 * Helper function to pad a single digit number with a leading zero
 */
var padZeroes = function(val) {
  return ('0' + val).slice(-2)
}

/**
 * Transform date to YYYY-MM-DD string
 *
 * @param {Date} date
 * @returns {String}
 */
exports.date = function(date) {
  date = date || new Date();
  return [
    date.getFullYear(),
    padZeroes(date.getMonth() + 1),
    padZeroes(date.getDate())
  ].join('-') + '-'
}
