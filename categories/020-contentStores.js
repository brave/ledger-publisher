const contentStoresTLD = [
  'github.io',
  'githubusercontent.com',
  's3.amazonaws.com'
]

const contentStoresSLD = [
  'amazonaws.com',
  'tumblr.com',
  'wordpress.com'
]

module.exports = {
  retrieve: function (cb) {
    cb(null, contentStoresSLD.concate(contentStoresTLD))
  },

  build: function (cb) {
    const transformedListTLD = contentStoresTLD.map((item) => { return `'${item}'` }).join(', ')
    const transformedListSLD = contentStoresSLD.map((item) => { return `'${item}'` }).join(', ')
    const condition = `(new Set([ ${transformedListTLD} ])).has(TLD) || (new Set([ ${transformedListSLD} ])).has(SLD)`
    const rule = {
      condition: condition,
      consequent: null,
      description: 'exclude content stores'
    }
    cb(null, rule)
  }
}
