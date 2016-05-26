var fs = require('fs')
var getPublisher = require('./index').getPublisher
var Synopsis = require('./index').Synopsis
var underscore = require('underscore')

var sites = JSON.parse(fs.readFileSync(process.env.HOME + '/Library/Application Support/Brave/session-store-1')).sites
var locations = {}
var publishers = {}

var synopsis = new Synopsis()

sites.forEach(function (site) {
  var markup, publisher
  var location = site.location

  if (location) synopsis.addVisit(location, Math.random() * 300 * 1000)

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

var keys = underscore.keys(publishers).sort()
console.log('\npublishers:')
console.log(keys)

var mappings = {}
keys.forEach(function (publisher) {
  mappings[publisher] = publishers[publisher]
})
console.log('\nmappings:')
console.log(JSON.stringify(mappings, null, 2))

console.log('\nsynopsis #1:')
console.log(JSON.stringify(synopsis.topN(), null, 2))

console.log('\nwinner:')
console.log(synopsis.winner())

var hhmm = function (hh, mm) {
  return (((hh * 60) + mm) * 60 * 1000)
}

synopsis = new Synopsis(JSON.stringify({ publishers: [
  { publisher: 'reddit.com', visits: 311, duration: hhmm(5, 12), score: 10 },
  { publisher: 'nytimes.com', visits: 287, duration: hhmm(4, 24), score: 9 },
  { publisher: 'huffingtonpost.com', visits: 265, duration: hhmm(4, 11), score: 8 },
  { publisher: 'theguardian.com', visits: 145, duration: hhmm(3, 42), score: 8 },
  { publisher: 'engadget.com', visits: 124, duration: hhmm(2, 42), score: 8 },
  { publisher: 'forbes.com', visits: 115, duration: hhmm(1, 42), score: 0 },
  { publisher: 'sfgate.com', visits: 98, duration: hhmm(1, 42), score: 50 },
  { publisher: 'bloomberg.com', visits: 95, duration: hhmm(1, 42), score: 4 },
  { publisher: 'drudgereport.com', visits: 90, duration: hhmm(1, 42), score: 2 },
  { publisher: 'cbsnews.com', visits: 87, duration: hhmm(1, 42), score: 1 }
]}))
console.log('\nsynopsis #2:')
console.log(JSON.stringify(synopsis.topN(), null, 2))

console.log('\nwinner:')
console.log(synopsis.winner())
