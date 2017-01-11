const domains = [
  'awkwardfamilyphotos.com',
  'diply.com',
  'feedly.com',
  'imdb.com',
  'reddit.com',
  'stackexchange.com',
  'superuser.com',
  'ycombinator.com',
  'azlyrics.com',
  'dingit.tv',
  'diply.com',
  'douban.com',
  'gamefaqs.com',
  'gamepedia.com',
  'gsmarena.com',
  'ign.com',
  'imdb.com',
  'subscene.com',
  'theladbible.com',
  'wikia.com',
  'wikihow.com',
  'babycenter.com',
  'biblegateway.com',
  'billboard.com',
  'bodybuilding.com',
  'alodokter.com',
  'brainyquote.com',
  'yelp.com',
  'kinopoisk.ru',
  'tripadvisor.com',
  'redd.it'
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
