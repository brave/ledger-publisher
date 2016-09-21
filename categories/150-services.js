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
  'soso.com'
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
