const searchEngines = [
  'baidu',
  'bing',
  'dogpile',
  'google',
  'ixquick',
  'kvasir',
  'searx',
  'sogou',
  'yahoo',
  'yandex',
  'youdao'
]

const searchEnginesSLD = [
  '1337x.to',
  'ask.com',
  'bab.la',
  'haosou.com',
  'indeed.com',
  'myway.com',
  'rambler.ru',
  'so.com',
  'soso.com',
  'torrentz2.eu',
  'weblio.jp',
  'youth.cn'
]

const regexpEscape = function (s) { return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') }

module.exports = {
  retrieve: function (cb) {
    cb(null, searchEnginesSLD.concat(searchEngines))
  },

  build: function (cb) {
    const transformedList = searchEngines.map((item) => { return `'${item}'` }).join(', ')
    var condition = `(new Set([ ${transformedList} ])).has(SLD.split('.')[0])`
    searchEnginesSLD.forEach(function (SLD) {
      condition += ' || /' + regexpEscape(SLD) + '$/.test(SLD)'
    })

    const rule = {
      condition: condition,
      consequent: null,
      description: 'exclude search engines'
    }
    cb(null, rule)
  }
}
