const platforms = [
  'facebook',
  'github',
  'livejournal',
  'medium',
  'slack',
  'twitter',
  'wikipedia',
  'xvideos',
  'youtube',
  'linkedin',
  'instagram',
  'pinterest',
  'blogspot',
  'imgur',
  'stackoverflow',
  'blogger',
  'craigslist',
  'bilibili',
  'youku',
  'quora',
  'vk'
]

module.exports = {
  retrieve: function (cb) {
    cb(null, platforms)
  },

  build: function (cb) {
    const transformedList = platforms.map((item) => { return `'${item}'` }).join(', ')
    const rule = {
      condition: `(new Set([ ${transformedList} ])).has(SLD.split('.')[0])`,
      consequent: null,
      description: 'exclude platforms'
    }
    cb(null, rule)
  }
}
