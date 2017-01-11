const domains = [
  '4dsply.com',
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
  'onclickads.net',
  'outbrain.com',
  'popads.net',
  'poptm.com',
  'sh.st'
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
