const domains = [
  '3dmgame.com',
  '4399.com',
  '6park.com',
  'alodokter.com',
  'babycenter.com',
  'bodybuilding.com',
  'dingit.tv',
  'diply.com',
  'douban.com',
  'feedly.com',
  'ozock.com',
  'providr.com',
  'redd.it',
  'reddit.com',
  'reddituploads.com',
  'subscene.com',
  'superuser.com',
  'theladbible.com',
  'tripadvisor.com',
  'webtretho.com',
  'ycombinator.com',
  'yelp.com',
  'yesky.com'
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
      description: 'exclude aggregators'
    }
    cb(null, rule)
  }
}
