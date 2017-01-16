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
  '123rf.com',
  '1337x.to',
  '2gis.ru',
  'alluc.ee',
  'ask.com',
  'aviasales.ru',
  'bab.la',
  'bdjobs.com',
  'carsensor.net',
  'consultant.ru',
  'duckduckgo.com',
  'ecosia.org',
  'feebee.com.tw',
  'futhead.com',
  'gettyimages.com',
  'gnavi.co.jp',
  'haosou.com',
  'ikman.lk',
  'indeed.co.uk',
  'indeed.com',
  'indeed.fr',
  'instamp3.co',
  'intercambiosvirtuales.org',
  'iplayer.fm',
  'istockphoto.com',
  'jalan.net',
  'jobrapido.com',
  'katcr.to',
  'kayak.com',
  'kickasstop.net',
  'kinopoisk.ru',
  'linguee.com',
  'linguee.de',
  'linguee.es',
  'linguee.fr',
  'mangvieclam.com',
  'mappy.com',
  'marinetraffic.com',
  'masutabe.info',
  'monster.com',
  'myprivatesearch.com',
  'mytorrents.org',
  'myway.com',
  'pron.tv',
  'rambler.ru',
  'realtor.com',
  'rightmove.co.uk',
  'searchincognito.com',
  'seek.com.au',
  'shine.com',
  'shutterstock.com',
  'siteadvisor.com',
  'skyscanner.com',
  'slack.com',
  'slickdeals.net',
  'so.com',
  'soso.com',
  'sporx.com',
  'symbolab.com',
  'thesaurus.com',
  'tineye.com',
  'torlock.com',
  'torrentdownloads.me',
  'torrentfunk.com',
  'torrentking.eu',
  'torrentproject.se',
  'torrentz2.eu',
  'translate.ru',
  'tripadvisor.co.uk',
  'tripadvisor.com',
  'tripadvisor.es',
  'tripadvisor.in',
  'tripadvisor.it',
  'tripadvisor.ru',
  'weblio.jp',
  'who.is',
  'withgoogle.com',
  'wolframalpha.com',
  'yify-torrent.org',
  'yifymovie.re',
  'youth.cn',
  'zezoomglobal.com',
  'zillow.com',
  'ziprecruiter.com',
  'zoopla.co.uk',
  'zybang.com'
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
