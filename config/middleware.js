
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, 'LoremIpsumDolorSitAmet', (err, result) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.token = result

    next()
  })
}
