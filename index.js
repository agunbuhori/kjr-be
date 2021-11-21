const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const UserHandler = require('./handler/UserHandler')
const ScheduleHandler = require('./handler/ScheduleHandler')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const corsMiddleware = cors()

require('dotenv').config()

app.use(bodyParser())

app.post('/public_token', corsMiddleware, (req, res) => {
  const token = jwt.sign({ origin:  req.headers.origin}, 'LoremIpsumDolorSitAmet', {expiresIn: '2h'})

  res.send({token, origin: req.headers.origin})
})

app.use('/user', UserHandler)
app.use('/schedule', ScheduleHandler)

app.listen(5000, () => {
  console.log("Server running");
})