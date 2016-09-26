const rules = require('../categories')

rules.all(function (err, definition) {
  console.log('module.exports = ' + JSON.stringify(definition, null, 2))
})
