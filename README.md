# ledger-publisher
Routines to identify publishers for the [Brave ledger](https://github.com/brave/ledger):

* [Mapping a URL to a Publisher Identity](#publisher-identities)
* [Adding a Page Visit to a Browsing Synopsis](#page-visits)

## Publisher Identities
A _publisher identity_ is derived from a URL and is intended to correspond to the publisher associated with the URL.

    var getPublisher = require('ledger-publisher').getPublisher

    var publisher = getPublisher('URL')

Note that because some domains host multiple publishers,
a publisher identity may contain both a _domain_ and a _path_ separated by a solidus(`/`).

For many reasons,
there may be a one-to-many relationship between a real-world publisher and a publisher identity.
In particular,
owing to numerous ad-hoc naming conventions on the Web,
these two publisher identities:

    medium.com/USER
    medium.com/@USER

refer to the same publisher,
but only if these URLs:

    https://medium.com/USER
    https://medium.com/@USER

are both provisioned.

Finally,
certain URLs aren't really appropriate for a publisher mapping.
For example,
if a URL returns a 302,
don't bother mapping that URL.

### Terminology
Consider this URL:

    https://foo.bar.example.com/component1/...?query

The label `com` from the URL's domain is a [top-level domain](https://en.wikipedia.org/wiki/Top-level_domain) (TLD),
and the string `example.com` is a [second-level domain](https://en.wikipedia.org/wiki/Second-level_domain) (SLD).
By convention,
the _relative domain_ (RLD) is the string to the left of the SLD (e.g., `foo.bar`),
and the _qualifying label_ (QLD) is the right-most label of the RLD (e.g., `bar`).

There are two popular types of TLDs:
[infrastructure](https://en.wikipedia.org/wiki/Top-level_domain#Infrastructure_domain)
and [international country code](https://en.wikipedia.org/wiki/Internationalized_country_code_top-level_domain) (ccTLD).

Although an SLD is normally thought of being the next-to-last right-most label (e.g., `example`),
for domains with a ccTLD,
the convention differs.
Consider this URL:

    http://search.yahoo.co.jp/search?query

The string `co.jp` corresponds to the TLD, the string `yahoo.co.jp` corresponds to the SLD,
and the QLD and RLD are both the string `search`.

### Syntax
The ABNF syntax for a publisher identity is:

    publisher-identity = domain [ "/" segment ]

                domain = [ RLD "." ] SLD
                   RLD = *[ label "." ] QLD
                   QLD = label
                   SLD = label "." TLD
                   TLD = infraTLD / ccTLD
                 ccTLD = label "." 2ALPHA                ; a two-letter country code, cf. ISO 3166
              infraTLD = label                           ; ".com", ".gov", etc.

                 label = alphanum *62(alphanum / "-")    ; any octet encoded according to RFC 2181
              alphanum = ALPHA / DIGIT

               segment = *pchar                          ; as defined in Section 3.3 of RFC 3986

### Mapping
The package uses a rule set expressed as a [JavaScript](https://en.wikipedia.org/wiki/JavaScript) array.

Each rule in the array consists of an object with two mandatory properties:

* `condition` - a JavaScript boolean expression

* `consequent` - a JavaScript expression returning either a string, `null`, or `undefined`

To detetermine the publisher identity associated with a URL:

1. If the TLD associated with the URL's domain does not correspond to an infrastructure or ccTLD,
then the publisher identity is `undefined`.

2. The URL is parsed into an object using the [URL module](https://nodejs.org/api/url.html).

3. The parsed object is extended with the `URL`, `TLD`, `SLD`, `RLD`, and `QLD` objects.
If there is no `RLD`, the empty string (`""`) is used for both the `RLD` and `QLD`.

4. If the `markupP` property of the rule is present and is `true`,
then the HTML associated with the URL must be present,
and three additional objects are present during evaluation:

    * `markup` - the markup expressed as a JavaScript string

    * `document` - the corresponding [DOM](https://en.wikipedia.org/wiki/Document_Object_Model) object,
as created by the [jsdom.jsdom](https://github.com/tmpvar/jsdom) method

    * `location` - a `function` with parameters `(markup, document, selector)` that returns a substring from the `markup` by
applying the `selector` to the `document`

5. Each rule is examined, in order, starting from the first element:

    5.1. If the `condition` evaluates to `false`,
then execution continues with the next rule.

    5.2. Otherwise,
the `consequent` is evaluated.

    5.3. If the resulting value is the empty string (`""`),
then execution continues with the next rule.

    5.4. If the resulting value is `false`, `null` or `undefined`,
then the publisher identity is `undefined`.

    5.5. Otherwise,
the resulting value is used as the publisher identity.

6. If Step 5.5 is never executed,
then the publisher identity is `undefined`.

An initial rule set is available as:

    require('ledger-publisher').rules

### Your Help is Needed!
Please submit a [pull request](https://github.com/brave/ledger-publisher/pulls) with updates to the rule set.

If you are running the [Brave Browser](https://brave.com/downloads.html) on your desktop,
you can run

    % node test.js

in order to examine all the URLs you have visited in your current session (from the file `session-store-1`)
and see the resulting publisher identities.

## Page Visits
A _page visit_ is just what you'd expect,
but it requires both a URL and the duration of the focus (in milliseconds).
A synopsis is a collection of page visits that have been reduced to a a publisher and a score.
The synopsis includes a rolling window so that older visits are removed.

    var synopsis = new (require('ledger-publisher').Synopsis)()


    // each time a page is unloaded, record the focus duration
    // markup is an optional third-parameter, cf., getPublisher above

        synopsis.addVisit('URL', duration)

In order to calculate the score,
options can be provided when creating the object.
The defaults are:

    { minDuration    : 2 * 1000
    , durationWeight : 1 / (30 * 1000)
    , numFrames      : 30
    , frameSize      : 24 * 60 * 60 * 1000
    }

When `addVisit` is invoked,
the duration must be at least `minDuration` milliseconds in length.
If so,
the score for the visit is calculated as:

    visitWeight + (duration * durationWeight)

So, 
a page view with a minute long focus will result in a score of `3`.
If the score is negative,
then it is not recorded.

The sliding window consist of `numFrames` frames,
each having a timeframe of `frameSize` milliseconds.
So, for the default values,
the sliding window will be `30` days long.

Once a synopsis is underway,
the "top N" publishers can be determined.
Each publisher will has an associated weighted score,
so that the sum of the scores "should approximate" `1.0`:

    // get the top "N" publishers

       console.log(JSON.stringify(synopsis.topN(20), null, 2))

    // e.g., [ { publisher: "example.com", weight 0.0123456789 } ... ]

The parameter to the `topN` method is optional.

Similarly,
to pseudo-randomly select a single publisher,
using the weighted score:

    // select a single publisher

       console.log(synopsis.winner())

    // e.g., "brave.com"

A optional parameter may be supplied to the `winner` method

## Acknowledgements
Many thanks to [Elijah Insua](https://github.com/tmpvar) for the excellent [jsdom](https://github.com/tmpvar/jsdom) package,
and to [Thomas Parisot](https://github.com/oncletom) for the excellent [tldjs](https://github.com/oncletom/tld.js) package.
