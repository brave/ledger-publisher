const async = require('async')
const path = require('path')

const LOCATION = 'categories'

const modules = [
  'search',
  'imageStores',
  'contentStores',
  'machineTranslations',
  'platforms',
  'messagingApps',
  'redirection',
  'campaignEngines',
  'top100',
  'government',
  'brave',
  'default'
]

module.exports = {
  modules: function() {
    return modules
  },
  all: function (done) {
    async.map(modules, function (module, cb)  {
      require('./' + path.join(LOCATION, module)).build(cb)
    }, done)
  }
}
