const searchEngines = [
  'baidu',
  'bing',
  'google',
  'sogou',
  'yahoo',
  'yandex',
  'youdao'
]

module.exports = {
  retrieve: function (cb) {
    cb(null, searchEngines)
  },

  build: function (cb) {
    const transformedList = searchEngines.map((item) => { return `'${item}'` }).join(', ')
    const rule = {
      condition: `(new Set([ ${transformedList} ])).has(SLD.split('.')[0])`,
      consequent: null,
      description: 'exclude search engines'
    }
    cb(null, rule)
  }
}
