const hotfix = [
  'aa.com',
  'armani.com',
  'barclaycardus.com',
  'citi.com',
  'colorlib.com',
  'crunchbase.com',
  'focusmagic.com',
  'grishinrobotics.com',
  'grubbco.com',
  'harvestapp.com',
  'hunter.io',
  'johnmuirhealth.com',
  'kickstarter.com',
  'maxthon.com',
  'mrporter.com',
  'quantcast.com',
  'shiftinglight.com',
  'shopify.com',
  'similarweb.com',
  'staples.com',
  'submittable.com',
  'tagdiv.com',
  'themeforest.net',
  'uline.com',
  'uphold.com',
  'ups.com',
  'wine.com',
  'wpdrudge.com',
  'wpmudev.org',
  'xfinity.com'
]

module.exports = {
  retrieve: function (cb) {
    cb(null, hotfix)
  },

  build: function (cb) {
    const transformedList = hotfix.map((item) => { return `'${item}'` }).join(', ')
    const rule = {
      condition: `(new Set([ ${transformedList} ])).has(SLD)`,
      consequent: null,
      description: 'hotfix exclusion list'
    }
    cb(null, rule)
  }
}
