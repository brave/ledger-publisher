const rules = require('../rules')

rules.all(function (err, definition) {
  console.log(JSON.stringify(definition, null, 2))
})
