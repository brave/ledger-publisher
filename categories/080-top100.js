const top100 = [
  'youtube.com',
  'amazon.com',
  'live.com',
  'taobao.com',
  'linkedin.com',
  'instagram.com',
  'vk.com',
  'ebay.com',
  'pinterest.com',
  'tmall.com',
  'amazon.co.jp',
  'mail.ru',
  '360.cn',
  'netflix.com',
  'sohu.com',
  'onclickads.net',
  'microsoft.com',
  'paypal.com',
  'blogspot.com',
  'imgur.com',
  'naver.com',
  'stackoverflow.com',
  'apple.com',
  'aliexpress.com',
  'xvideos.com',
  'imdb.com',
  '163.com',
  'fc2.com',
  'jd.com',
  'ok.ru',
  'amazon.in',
  'blogger.com',
  'office.com',
  'craigslist.org',
  'amazon.de',
  'rakuten.co.jp',
  'nicovideo.jp',
  'booking.com',
  'soso.com',
  'pixnet.net',
  'dropbox.com',
  'bilibili.com',
  'alibaba.com',
  'youku.com',
  'diply.com',
  'amazon.co.uk',
  'outbrain.com',
  'alipay.com',
  'popads.net',
  'microsoftonline.com',
  'quora.com',
  'coccoc.com',
  'chase.com',
  'docusign.net'
]

module.exports = {
  retrieve: function (cb) {
    cb(null, top100)
  },

  build: function (cb) {
    const transformedList = top100.map((item) => { return `'${item}'` }).join(', ')
    const rule = {
      condition: `(new Set([ ${transformedList} ])).has(SLD)`,
      consequent: null,
      description: 'excluded Alexa top 100 (some entries in earlier rules)'
    }
    cb(null, rule)
  }
}
