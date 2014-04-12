var humanize = requireService('humanizer')

describe('humanizer', function() {

  it('formats a date to YYYY-MM-DD-', function(done) {
    humanize.date(new Date(Date.parse('July 10, 1995'))).should.equal('1995-07-10-')
    done()
  })
})
