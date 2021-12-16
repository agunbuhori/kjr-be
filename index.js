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
app.get('/', (req, res) => {
  res.send({
    status: 200,
    message: "Server is working"
  })
});

app.post('/public_token', (req, res) => {
  const token = jwt.sign({ origin:  req.headers.origin}, 'LoremIpsumDolorSitAmet', {expiresIn: '2h'})
  res.send({token, origin: req.headers.origin})
})

app.use('/admin', AdminHandler)
app.use('/user', UserHandler)
app.use('/schedule', ScheduleHandler)

app.listen(80, () => {
  console.log("Server running");
})