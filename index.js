var datax = require('data-expression')
var Joi = require('joi')
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

var schema = Joi.array().items(Joi.object().keys(
  { condition: Joi.alternatives().try(Joi.string().description('a JavaScript boolean expression'),
                                      Joi.boolean().allow(true).description('only "true" makes sense')).required(),
    consequent: Joi.alternatives().try(Joi.string().description('a JavaScript string expression'),
                                      Joi.any().allow(false, null).description('or null').required()),
    markupP: Joi.boolean().optional().description('HTML required to evaluate consequent'),
    description: Joi.string().optional().description('a brief annotation')
  }
))

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

    result = rule.consequent ? datax.evaluate(rule.consequent, props) : rule.consequent
    if (result === '') continue

    if (result) return trim(result, './')

    // map null/false to undefined
    return
  }
}

var Synopsis = function (options) {
  this.options = options || {}
  underscore.defaults(this.options, { minDuration: 2000, durationWeight: 1 / (30 * 1000) })

  this.publishers = {}
}

Synopsis.prototype.addClick = function (path, duration, markup) {
  var publisher

  if (duration < this.options.minDuration) return

  try { publisher = getPublisher(path, markup) } catch (ex) { return }
  if (!publisher) return

  if (!this.publishers[publisher]) this.publishers[publisher] = { views: 0, duration: 0 }
  this.publishers[publisher].views++
  this.publishers[publisher].duration += duration

  this.publishers[publisher].score = this.publishers[publisher].views +
                                       (this.publishers[publisher].duration * this.options.durationWeight)
}

Synopsis.prototype.topN = function (n) {
  var i, results, total

  results = []
  underscore.keys(this.publishers).forEach(function (publisher) {
    results.push({ publisher: publisher, score: this.publishers[publisher].score })
  }, this)
  results = underscore.sortBy(results, function (entry) { return -entry.score })

  if ((n > 0) && (results.length > n)) results = results.slice(0, n)
  n = results.length

  total = 0
  for (i = 0; i < n; i++) { total += results[i].score }
  if (total === 0) return

  for (i = 0; i < n; i++) {
    results[i].weight = results[i].score / total
    delete results[i].score
  }
  return results
}

module.exports = {
  getPublisher: getPublisher,
  rules: rules,
  schema: schema,
  Synopsis: Synopsis
}
