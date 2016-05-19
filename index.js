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

   search.yahoo.co.jp
    QLD = 'search'
    RLD = 'search'
    SLD = 'yahoo.co.jp'
    TLD = 'co.jp'
 */

var rules = [
 { condition: "SLD === 'medium.com' && (pathname.indexOf('/@') === 0 || pathname.split('/')[1] !== 'browse')",
   consequent: "SLD + '/' + pathname.split('/')[1]"
 },

 { condition: "SLD === 'twitter.com'",
   consequent: "SLD + '/' + pathname.split('/')[1]"
 },

 { condition: "SLD === 'tumblr.com' && QLD !== 'www' && QLD !== 'assets' && QLD !== 'media'",
   consequent: "RLD + '.' + SLD"
 },
 { condition: "SLD === 'tumblr.com' && QLD === 'www' && (pathname == '/' || pathname == '/dashboard' || pathname == '/login')",
   consequent: 'SLD'
 },
 { condition: "SLD === 'tumblr.com' && QLD === 'www'",
   consequent: "pathname.split('/')[1] + '.' + SLD"
 },

 { condition: "SLD === 'wordpress.com' || SLD === 'zendesk.com'",
   consequent: "RLD + '.' + SLD"
 },

 { condition: "SLD === 'youtube.com' && pathname.indexOf('/channel/') === 0",
   consequent: 'SLD + pathname'
 },
 { condition: "SLD === 'youtube.com' && pathname === '/watch'",
   consequent: '"youtube.com/channel/" + /content="([^"]*)"/.exec(location(markup, document, "div#watch7-content.watch-main-col meta[itemprop=channelId]"))[1]',
   markupP: true
 },

 { condition: "[ 'baidu', 'bing', 'google', 'sogou', 'yahoo', 'yandex', 'youdao' ].indexOf(SLD.split('.')[0]) !== -1",
   consequent: null,
   description: 'search engines'
 },

 { condition: true,
   consequent: 'SLD',
   description: 'the default rule'
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

  props = underscore.mapObject(props, function (value, key) { if (!underscore.isFunction(value)) return value })
  props.URL = path
  props.SLD = tldjs.getDomain(props.host)
  props.RLD = tldjs.getSubdomain(props.host)
  props.QLD = props.RLD ? underscore.last(props.RLD.split('.')) : ''

  for (i = 0; i < rules.length; i++) {
    rule = rules[i]
    result = datax.evaluate(rule.consequent, props)

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

    if (result === '') continue

    if (result) return trim(result, './')

    // map a null return to undefined
    return
  }
}

module.exports = {
  getPublisher: getPublisher,
  rules: rules
}
