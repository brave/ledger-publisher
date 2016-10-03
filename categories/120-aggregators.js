const domains = [
  'awkwardfamilyphotos.com',
  'diply.com',
  'feedly.com',
  'imdb.com',
  'reddit.com',
  'stackexchange.com',
  'superuser.com',
  'ycombinator.com'
]

module.exports = {
  retrieve: function (cb) {
    cb(null, domains)
  },

  build: function (cb) {
    const transformedList = domains.map((item) => { return `'${item}'` }).join(', ')
    const rule = {
      condition: `(new Set([ ${transformedList} ])).has(SLD)`,
      consequent: null,
      description: 'exclude aggregators'
    }
    cb(null, rule)
  }
}
