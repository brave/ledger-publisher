const government=[
'acm.nl',
'consuwijzer.nl',
'digid.nl',
'europa.eu',
'officielebekendmakingen.nl',
'overheid.nl ]

module.exports = {
  retrieve: function (cb) {
    cb(null, [])
  },

  build: function (cb) {
    const rule = {
      condition: "TLD === 'gov' || /^go.[a-z][a-z]$/.test(TLD) || /^gov.[a-z][a-z]$/.test(TLD)",
      consequent: null,
      description: 'exclude all government sites'
    }
    cb(null, rule)
  }
}
