const jwt = require('jsonwebtoken')
const secret = "TSLKJRAmanLoremIpsum"

function authorizeAdmin(req, res, next) {
  if (req.headers.authorization) {
    let token = req.headers.authorization.replace('Bearer ', '')
    let auth = jwt.decode(token, secret)

    if (auth?.user === 'superadmin') {
      next()
    } else {
      return res.status(403).send("Unauthorized")
    }
  } else {
    return res.status(403).send("Unauthorized")
  }
}

module.exports = authorizeAdmin