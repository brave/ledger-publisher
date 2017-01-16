const domains = [
  '4dsply.com',
  'aarth.com',
  'ab4hr.com',
  'adcash.com',
  'adexc.net',
  'adexchangeprediction.com',
  'adf.ly',
  'adnetworkperformance.com',
  'adscpm.net',
  'altadefinizione01.black',
  'anetwork.ir',
  'avito.ru',
  'backpage.com',
  'bankia.es',
  'blackfriday.com',
  'clicksgear.com',
  'clixsense.com',
  'cloudfront.net',
  'disqus.com',
  'doubleclick.net',
  'doublepimp.com',
  'drom.ru',
  'encuentra24.com',
  'exoclick.com',
  'hilltopads.net',
  'idealista.com',
  'juicyads.com',
  'kolesa.kz',
  'lichess.org',
  'mama.cn',
  'mcafee.com',
  'mgid.com',
  'mixplugin.com',
  'newpoptab.com',
  'njuskalo.hr',
  'offerreality.com',
  'olx.in',
  'olx.ro',
  'onclickads.net',
  'opera.com',
  'outbrain.com',
  'payu.in',
  'popads.net',
  'poptm.com',
  'pornhubpremium.com',
  'redirectvoluum.com',
  'semrush.com',
  'sh.st',
  'slimspots.com',
  'spotscenered.info',
  'terraclicks.com',
  'theblackfriday.com',
  'thewhizmarketing.com',
  'thewhizproducts.com',
  'trackingclick.net',
  'tradeadexchange.com',
  'traffichaus.com',
  'tvplusnewtab.com',
  'utarget.ru',
  'vibbo.com',
  'vimeo.com',
  'vppgamingnetwork.com'
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
      description: 'exclude advertising platforms'
    }
    cb(null, rule)
  }
}
