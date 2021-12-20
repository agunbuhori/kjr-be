var whitelist = ['https://kjr.kampustsl.id', 'http://localhost:3001', 'http://localhost:3000', 'https://admin-kjr.kampustsl.id']

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