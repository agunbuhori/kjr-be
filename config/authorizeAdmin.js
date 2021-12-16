const jwt = require('jsonwebtoken')
const { errorHandler } = require('../handler/handler')
const SECRET = "TSLKJRAmanLoremIpsum"

function authorizeAdmin(req, res, next) {
  if (req.headers.authorization) {
    let token = req.headers.authorization.replace('Bearer ', '')
    let auth = jwt.decode(token, SECRET)

    if (auth.username === 'kjr') {
      next()
    } else {
      return res.status(403).send(errorHandler("Unauthorized"))
    }
  } else {
    return res.status(403).send(errorHandler("Unauthorized"))
  }
}

module.exports = authorizeAdmin