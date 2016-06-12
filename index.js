var datax = require('data-expression')
var Joi = require('joi')
var jsdom = require('jsdom')
var random = require('random-lib')
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

var isPublisher = function (publisher) {
  var props
  var parts = publisher.split('/')

  if (!tldjs.isValid(parts[0])) return false
  if (parts.length === 1) return true

  props = url.parse('https://' + publisher)
  return ((!props.hash) && (!props.search))
}

var Synopsis = function (options) {
  var p

  this.publishers = {}
  if ((typeof options === 'string') || (Buffer.isBuffer(options))) {
    p = JSON.parse(options)

    options = p.options
    this.publishers = p.publishers
  }

  this.options = options || {}
  underscore.defaults(this.options, { minDuration: 2 * 1000, durationWeight: 1 / (30 * 1000),
                                      numFrames: 30, frameSize: 24 * 60 * 60 * 1000
                                    })

  this.options._a = (1 / (this.options.durationWeight * 2)) - this.options.minDuration
  this.options._a2 = this.options._a * 2
  this.options._a4 = this.options._a2 * 2
  this.options._b = this.options.minDuration - this.options._a
  this.options._b2 = this.options._b * this.options._b
}

Synopsis.prototype.addVisit = function (path, duration, markup) {
  var publisher, score
  var now = underscore.now()

  if (duration < this.options.minDuration) return

  score = this.score(duration)
  if (score <= 0) return

  try { publisher = getPublisher(path, markup) } catch (ex) { return }
  if (!publisher) return

  if (!this.publishers[publisher]) {
    this.publishers[publisher] = { visits: 0, duration: 0, score: 0,
                                   window: [ { timestamp: now, visits: 0, duration: 0, score: 0 } ] }
  }

  if (this.publishers[publisher].window[0].timestamp <= now - this.frameSize) {
    this.publishers[publisher].window =
      this.publishers[publisher].window.splice(0, 0, { timestamp: now, visits: 0, duration: 0, score: 0 })
  }

  this.publishers[publisher].window[0].visits++
  this.publishers[publisher].window[0].duration += duration
  this.publishers[publisher].window[0].score += score

  this.publishers[publisher].visits++
  this.publishers[publisher].duration += duration
  this.publishers[publisher].score += score

  return publisher
}

Synopsis.prototype.topN = function (n) {
  var i, results, total

  this.prune()

  results = []
  underscore.keys(this.publishers).forEach(function (publisher) {
    results.push(underscore.extend({ publisher: publisher }, underscore.omit(this.publishers[publisher], 'window')))
  }, this)
  results = underscore.sortBy(results, function (entry) { return -entry.score })

  if ((n > 0) && (results.length > n)) results = results.slice(0, n)
  n = results.length

  total = 0
  for (i = 0; i < n; i++) { total += results[i].score }
  if (total === 0) return

  for (i = 0; i < n; i++) results[i] = { publisher: results[i].publisher, weight: results[i].score / total }
  return results
}

Synopsis.prototype.winner = function (n) {
  var i, upper
  var point = random.randomFloat()
  var results = this.topN(n)

  upper = 0
  for (i = 0; i < results.length; i++) {
    upper += results[i].weight
    if (upper >= point) return results[i].publisher
  }
}

Synopsis.prototype.toJSON = function () {
  this.prune()

  return { options: this.options, publishers: this.publishers }
}

// courtesy of @dimitry-xyz: https://github.com/brave/ledger/issues/2#issuecomment-221752002
Synopsis.prototype.score = function (duration) {
  return (((-this.options._b) + Math.sqrt(this.options._b2 + (this.options._a4 * duration))) / this.options._a2)
}

Synopsis.prototype.prune = function () {
  var now = underscore.now()
  var then = now - (this.numFrames * this.frameSize)

  underscore.keys(this.publishers).forEach(function (publisher) {
    var i
    var duration = 0
    var entry = this.publishers[publisher]
    var score = 0
    var visits = 0

    // NB: in case of user editing...
    if (!entry.window) {
      entry.window = [ { timestamp: now, visits: entry.visits, duration: entry.duration, score: entry.score } ]
      return
    }

    for (i = 0; i < entry.window.length; i++) {
      if (entry.window[i].timestamp < then) break

      visits += entry.window[i].visits
      duration += entry.window[i].duration
      score += entry.window[i].score
    }

    if (i < entry.window.length) {
      entry.visits = visits
      entry.duration = duration
      entry.score = score
      entry.window = entry.window.slice(0, i)
    }
  }, this)
}

module.exports = {
  getPublisher: getPublisher,
  isPublisher: isPublisher,
  rules: rules,
  schema: schema,
  Synopsis: Synopsis
}
