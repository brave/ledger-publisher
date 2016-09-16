const rules = require('../categories')

rules.all(function (err, definition) {
  console.log(JSON.stringify(definition, null, 2))
})
