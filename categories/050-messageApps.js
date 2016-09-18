const messageApps = [
  'messenger',
  'skype',
  'whatsapp'
]

module.exports = {
  retrieve: function (cb) {
    cb(null, messageApps)
  },

  build: function (cb) {
    const transformedList = messageApps.map((item) => { return `'${item}'` }).join(', ')
    const rule = {
      condition: `(new Set([ ${transformedList} ])).has(SLD.split('.')[0])`,
      consequent: null,
      description: 'exclude messaging application'
    }
    cb(null, rule)
  }
}
