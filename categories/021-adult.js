const adult = [
  'hclips.com',
  'livejasmin.com',
  'spankbang.com',
  'tube8.com',
  'txxx.com',
  'upornia.com',
  'xhamster.com',
  'xnxx.com'
]

module.exports = {
  retrieve: function (cb) {
    cb(null, adult)
  },

  build: function (cb) {
    const transformedList = adult.map((item) => { return `'${item}'` }).join(', ')
    const rule = {
      condition: `(new Set([ ${transformedList} ])).has(SLD)`,
      consequent: null,
      description: 'exclude adult sites'
    }
    cb(null, rule)
  }
}
