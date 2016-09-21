const domains = [
  'live.com',
  'mail.ru',
  'netflix.com',
  'microsoft.com',
  'paypal.com',
  'apple.com',
  'fc2.com',
  'ok.ru',
  'office.com',
  'nicovideo.jp',
  'booking.com',
  'soso.com',
  'dropbox.com',
  'alipay.com',
  'microsoftonline.com',
  'coccoc.com',
  'chase.com',
  'docusign.net'
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
