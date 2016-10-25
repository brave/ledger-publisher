const contentStoresTLD = [
  'githubusercontent.com'
]

const contentStoresSLD = [
  'amazonaws.com',
  'herokuapp.com',
  'tumblr.com',
  'wordpress.com'
]

const regexpEscape = function (s) { return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') }

module.exports = {
  retrieve: function (cb) {
    cb(null, contentStoresSLD.concate(contentStoresTLD))
  },

  build: function (cb) {
    const transformedListTLD = contentStoresTLD.map((item) => { return `'${item}'` }).join(', ')
    var condition = `(new Set([ ${transformedListTLD} ])).has(TLD)`
    contentStoresSLD.forEach(function (SLD) {
      condition += ' || /' + regexpEscape(SLD) + '$/.test(SLD)'
    })

    const rule = {
      condition: condition,
      consequent: null,
      description: 'exclude content stores'
    }
    cb(null, rule)
  }
}
