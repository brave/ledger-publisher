const domains = [
  'onclickads.net',
  'outbrain.com',
  'popads.net'
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
      description: 'exclude add platforms'
    }
    cb(null, rule)
  }
}
