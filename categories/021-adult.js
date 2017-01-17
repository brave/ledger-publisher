const adult = [
  'cam4.es',
  'camgasm.com',
  'caribbeancom.com',
  'chaturbate.com',
  'cumlouder.com',
  'dmm.co.jp',
  'duga.jp',
  'efukt.com',
  'empflix.com',
  'eporner.com',
  'fantasti.cc',
  'gotporn.com',
  'h2porn.com',
  'hclips.com',
  'iceporn.com',
  'imlive.com',
  'indianpornvideos.com',
  'javbus.com',
  'javhd.com',
  'javhihi.com',
  'literotica.com',
  'livejasmin.com',
  'loverslab.com',
  'manyvids.com',
  'mydirtyhobby.com',
  'nutaku.net',
  'porndig.com',
  'pornerbros.com',
  'pornhublive.com',
  'porntube.com',
  'prostoporno.tv',
  'pussyspace.com',
  'r18.com',
  'serviporno.com',
  'sheknows.com',
  'spankbang.com',
  'thumbzilla.com',
  'tnaflix.com',
  'tube8.com',
  'tukif.com',
  'txxx.com',
  'upornia.com',
  'vielerporno.com',
  'vjav.com',
  'vporn.com',
  'webteb.com',
  'xhamster.com',
  'xhamsterlive.com',
  'xnxx.com',
  'xonline.vip',
  'yespornplease.com'
]

module.exports = {
  retrieve: function (cb) {
    cb(null, adult)
  },

  build: function (cb) {
    const transformedList = adult.map((item) => { return `'${item}'` }).join(', ')
    const rule = {
      condition: `(new Set([ ${transformedList} ])).has(SLD)`,
      consequent: null,
      description: 'exclude adult sites'
    }
    cb(null, rule)
  }
}
