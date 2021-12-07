const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const UserHandler = require('./handler/UserHandler')
const ScheduleHandler = require('./handler/ScheduleHandler')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const AdminHandler = require('./handler/AdminHandler')

require('dotenv').config()

app.use(bodyParser())

app.use(cors())

app.post('/public_token', (req, res) => {
  const token = jwt.sign({ origin:  req.headers.origin}, 'LoremIpsumDolorSitAmet', {expiresIn: '2h'})

  res.send({token, origin: req.headers.origin})
})

app.use('/user', UserHandler)
app.use('/schedule', ScheduleHandler)
app.use('/admin', AdminHandler)

app.listen(5000, () => {
  console.log("Server running");
})