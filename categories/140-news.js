const domains = [
  'sohu.com',
  'naver.com',
  '163.com',
  'pixnet.net'
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
      description: 'exclude news platforms'
    }
    cb(null, rule)
  }
}
