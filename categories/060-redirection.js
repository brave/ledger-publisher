const redirectionPoints = [
  't.co'
]

module.exports = {
  retrieve: function (cb) {
    cb(null, redirectionPoints)
  },

  build: function (cb) {
    const transformedList = redirectionPoints.map((item) => { return `'${item}'` }).join(', ')
    const rule = {
      condition: `(new Set([ ${transformedList} ])).has(SLD)`,
      consequent: null,
      description: 'exclude redirection points'
    }
    cb(null, rule)
  }
}
