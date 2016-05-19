var fs = require('fs')
var getPublisher = require('./index').getPublisher
var underscore = require('underscore')

var sites = JSON.parse(fs.readFileSync(process.env.HOME + '/Library/Application Support/Brave/session-store-1')).sites
var locations = {}
var publishers = {}

sites.forEach(function (site) {
  var markup, publisher
  var location = site.location

  if ((!location) || (locations[location])) return
  locations[location] = site

  try {
    if (location.indexOf('https://www.youtube.com/watch') !== -1) {
      try { markup = require('knodeo-http-sync').httpSync.get(location).toString() } catch (err) {}
    }

    publisher = getPublisher(location, markup)
    if (!publisher) return

    if (!publishers[publisher]) publishers[publisher] = []
    publishers[publisher].push(location)
  } catch (err) {
    console.log(location + ': ' + err.toString())
  }
})

var results = {}
underscore.keys(publishers).sort().forEach(function (publisher) {
  results[publisher] = publishers[publisher]
})

console.log(JSON.stringify(results, null, 2))
