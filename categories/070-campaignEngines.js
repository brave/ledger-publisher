const campaignEngines = [
  'campaign-archive[0-9]+.com'
]

module.exports = {
  retrieve: function (cb) {
    cb(null, campaignEngines)
  },

  build: function (cb) {
    const rule = {
      condition: `/^campaign-archive[0-9]+\.com$/.test(SLD)`,
      consequent: null,
      description: 'exclude campaign engines'
    }
    cb(null, rule)
  }
}
