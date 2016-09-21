const imageStores = [
  'githubusercontent',
  'ssl-images-amazon',
  'twimg',
  'ytimg'
]

module.exports = {
  retrieve: function (cb) {
    cb(null, imageStores)
  },

  build: function (cb) {
    const transformedList = imageStores.map((item) => { return `'${item}'` }).join(', ')
    const rule = {
      condition: `(new Set([ ${transformedList} ])).has(SLD.split('.')[0])`,
      consequent: null,
      description: 'exclude image stores'
    }
    cb(null, rule)
  }
}
