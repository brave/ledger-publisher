var datax = require('data-expression')
var jsdom = require('jsdom')
var tldjs = require('tldjs')
var trim = require('underscore.string/trim')
var underscore = require('underscore')
var url = require('url')

/* foo.bar.example.com
    QLD = 'bar'
    RLD = 'foo.bar'
    SLD = 'example.com'
    TLD = 'com'
 */

var rules = [
 { condition: "SLD === 'tumblr.com' && QLD !== 'www' && QLD !== 'assets' && QLD !== 'media'",
   consequent: "RLD + '.' + SLD"
 },
 { condition: "SLD === 'tumblr.com' && QLD === 'www' && (pathname == '/' || pathname == '/dashboard' || pathname == '/login')",
   consequent: 'SLD'
 },
 { condition: "SLD === 'tumblr.com' && QLD === 'www'",
   consequent: "pathname.split('/')[1] + '.' + SLD"
 },

 { condition: "SLD === 'twitter.com'",
   consequent: "SLD + '/' + pathname.split('/')[1]"
 },

 { condition: "SLD === 'medium.com' && (pathname.indexOf('/@') === 0 || pathname.split('/')[1] !== 'browse')",
   consequent: "SLD + '/' + pathname.split('/')[1]"
 },

 { condition: "SLD === 'youtube.com' && pathname === '/watch'",
   consequent: '"https://www.youtube.com/channel/" + /content="([^"]*)"/.exec(location("div#watch7-content.watch-main-col meta[itemprop=channelId]"))[1]',
   markupP: true
 },

 { condition: true,
   consequent: 'SLD'
 }
]

var location = function (markup, document, selector) {
  var div = jsdom.nodeLocation(document.body.querySelector(selector))

  if (div.startTag) return markup.substr(div.startTag.end, div.endTag.start - div.startTag.end)

  return markup.substr(div.start, div.end - div.start)
}

var getPublisher = function (path, markup) {
  var i, props, result, rule

  if (!tldjs.isValid(path)) return

  props = url.parse(path, true)
  props.TLD = tldjs.getPublicSuffix(props.host)
  if (!props.TLD) return

  props.SLD = tldjs.getDomain(props.host)
  props.RLD = tldjs.getSubdomain(props.host)
  props.QLD = props.RLD ? underscore.last(props.RLD.split('.')) : ''

  for (i = 0; i < rules.length; i++) {
    rule = rules[i]
    if (!datax.evaluate(rule.condition, props)) continue

    if (rule.markupP) {
      if (!markup) throw new Error('markup parameter required')

      if (typeof markup !== 'string') markup = markup.toString()

      props.location = location
      props.markup = markup
      props.document = jsdom.jsdom(markup)
    } else {
      delete props.location
      delete props.markup
      delete props.document
    }

    result = datax.evaluate(rule.consequent, props)
    if (!result) continue

    return trim(result, './')
  }
}

module.exports = {
  getPublisher: getPublisher
}

var fs = require('fs')
var sites = JSON.parse(fs.readFileSync(process.env.HOME + '/Library/Application Support/Brave/session-store-1')).sites
var locations = {}
var publishers = {}
sites.forEach(function (site) {
  var publisher
  var location = site.location

  if ((!location) || (locations[location])) return
  locations[location] = site

  try {
    publisher = getPublisher(location)
    if (!publisher) return

    if (!publishers[publisher]) publishers[publisher] = []
    publishers[publisher].push(location)
  } catch (err) {
    console.log(location + ': ' + err.toString())
  }
})
console.log(JSON.stringify(publishers, null, 2))
