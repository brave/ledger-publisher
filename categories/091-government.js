const government=[
  'acm.nl',
  'consuwijzer.nl',
  'digid.nl',
  'europa.eu',
  'officielebekendmakingen.nl',
  'overheid.nl ]

module.exports = {
  retrieve: function (cb) {
    cb(null, government)
  },

  build: function (cb) {
    const transformedList = government.map((item) => { return `'${item}'` }).join(', ')
    const rule = {
      condition: `(new Set([ ${transformedList} ])).has(SLD)`,
      consequent: null,
      description: 'exclude government sites'
    }
    cb(null, rule)
  }
}
