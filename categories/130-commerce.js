const domains = [
  'amazon.com',
  'taobao.com',
  'ebay.com',
  'tmall.com',
  'amazon.co.jp',
  '360.cn',
  'aliexpress.com',
  'jd.com',
  'amazon.in',
  'amazon.de',
  'rakuten.co.jp',
  'alibaba.com',
  'amazon.co.uk'
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
      description: 'exclude commerce sites'
    }
    cb(null, rule)
  }
}
