const machineTranslations = [
  'baiducontent.com',
  'googleusercontent.com',
  'microsofttranslator.com',
  'youdao.com'
]

module.exports = {
  retrieve: function (cb) {
    cb(null, machineTranslations)
  },

  build: function (cb) {
    const transformedList = machineTranslations.map((item) => { return `'${item}'` }).join(', ')
    const rule = {
      condition: `(new Set([ ${transformedList} ])).has(SLD)`,
      consequent: null,
      description: 'exclude machine-translations'
    }
    cb(null, rule)
  }
}
