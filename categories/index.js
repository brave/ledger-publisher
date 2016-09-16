const glob = require('glob')
const path = require('path')
const async = require('async')

const modules = glob.sync('*.js', { ignore: 'index.js', cwd: path.basename(__dirname) })

module.exports = {
  modules: function() {
    return modules
  },
  all: function (done) {
    async.map(modules, function (module, cb)  {
      require('./' + module).build(cb)
    }, done)
  }
}
