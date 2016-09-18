const brave = [
  'brave.com',
]

module.exports = {
  retrieve: function (cb) {
    cb(null, brave)
  },

  build: function (cb) {
    const transformedList = brave.map((item) => { return `'${item}'` }).join(', ')
    const rule = {
      condition: `(new Set([ ${transformedList} ])).has(SLD)`,
      consequent: null,
      description: 'res ipsa loquitur'
    }
    cb(null, rule)
  }
}
