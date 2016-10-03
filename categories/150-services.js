const domains = [
  'alipay.com',
  'apple.com',
  'booking.com',
  'chase.com',
  'coccoc.com',
  'docusign.net',
  'dropbox.com',
  'fc2.com',
  'live.com',
  'mail.ru',
  'microsoft.com',
  'microsoftonline.com',
  'netflix.com',
  'nicovideo.jp',
  'office.com',
  'ok.ru',
  'paypal.com',
  'soso.com',
  'amtrak.com',
  'android.com',
  'antigate.com',
  'bbsconstruction.ca',
  'bitgo.com',
  'card-data.com',
  'coinbase.com',
  'digitalocean.com',
  'dreamhost.com',
  'duckduckgo.com',
  'entelo.com',
  'ethermine.org',
  'fitbit.com',
  'getaround.com',
  'getfinal.com',
  'gitlab.com',
  'icoconvert.com',
  'ifttt.com',
  'instacart.com',
  'ipchicken.com',
  'keybase.io',
  'librato.com',
  'mlab.com',
  'nanopool.org',
  'newrelic.com',
  'okcoin.com',
  'pagerduty.com',
  'prometheus.io',
  'roomserviceparty.com',
  'royalbank.com',
  'ryver.com',
  'solanolabs.com',
  'superhuman.com',
  'tdsecurities.com',
  'thecse.com',
  'toptal.com',
  'trakt.tv',
  'trycaviar.com',
  'upwork.com',
  'usefixie.com',
  'wpengine.com',
  'yelp.com',
  'zendesk.com',
  'presents.social'
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
      description: 'exclude services'
    }
    cb(null, rule)
  }
}
