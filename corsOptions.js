var whitelist = ['https://kjr.kampustsl.id', 'http://localhost:3000', undefined]

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