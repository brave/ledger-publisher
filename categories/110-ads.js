const domains = [
  'onclickads.net',
  'outbrain.com',
  'popads.net',
  '4dsply.com',
  'adexc.net',
  'adexchangeprediction.com',
  'adnetworkperformance.com',
  'clicksgear.com',
  'cloudfront.net',
  'doublepimp.com',
  'exoclick.com',
  'hilltopads.net',
  'mixplugin.com',
  'popads.net',
  'sh.st',
  'adscpm.net',
  'doubleclick.net',
  'poptm.com',
  'mama.cn',
  'adf.ly'
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
