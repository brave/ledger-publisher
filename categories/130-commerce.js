const domains = [
  '360.cn',
  'alibaba.com',
  'aliexpress.com',
  'amazon.co.jp',
  'amazon.co.uk',
  'amazon.com',
  'amazon.de',
  'amazon.in',
  'ebay.com',
  'jd.com',
  'rakuten.co.jp',
  'taobao.com',
  'tmall.com'
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
