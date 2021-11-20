var whitelist = ['https://kjr.kampustsl.id', 'http://localhost:3000', undefined]

var corsOptions = {
  origin: function (origin, callback) {
    callback(null, true)

  }
}

module.exports = corsOptions