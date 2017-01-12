const domains = [
  '4dsply.com',
  'ab4hr.com',
  'adexc.net',
  'adexchangeprediction.com',
  'adf.ly',
  'adnetworkperformance.com',
  'adscpm.net',
  'clicksgear.com',
  'cloudfront.net',
  'doubleclick.net',
  'doublepimp.com',
  'exoclick.com',
  'hilltopads.net',
  'mama.cn',
  'mixplugin.com',
  'newpoptab.com',
  'offerreality.com',
  'onclickads.net',
  'outbrain.com',
  'popads.net',
  'poptm.com',
  'redirectvoluum.com',
  'sh.st',
  'spotscenered.info',
  'terraclicks.com',
  'thewhizmarketing.com',
  'thewhizproducts.com',
  'trackingclick.net',
  'tradeadexchange.com',
  'tvplusnewtab.com'
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
