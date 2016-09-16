module.exports = {
  retrieve: function (cb) {
    cb(null, [])
  },

  build: function (cb) {
    const rule = {
      condition: true,
      consequent: 'SLD',
      description: 'the default rule'
    }
    cb(null, rule)
  }
}
