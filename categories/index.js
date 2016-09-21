const glob = require('glob')
const async = require('async')

const modules = glob.sync('[0-9]*.js', { cwd: __dirname }).sort()

const defaultRule = {
  condition: true,
  consequent: 'SLD',
  description: 'the default rule'
}

module.exports = {
  modules: function () {
    return modules
  },
  all: function (done) {
    const complete = (err, rules) => {
      rules = rules.concat(defaultRule)
      done(err, rules)
    }
    async.map(modules, function (module, cb) {
      require('./' + module).build(cb)
    }, complete)
  }
}
