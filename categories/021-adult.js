const adult = [
  'livejasmin.com',
  'spankbang.com',
  'tube8.com',
  'upornia.com',
  'xhamster.com',
  'xnxx.com',
  'hclips.com',
  'txxx.com']

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
