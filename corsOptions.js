var whitelist = ['https://kjr.kampustsl.id', 'http://localhost:3001', undefined, '144.91.113.251:443']

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS '))
    }
  }
}

module.exports = corsOptions