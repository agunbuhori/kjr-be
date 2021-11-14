const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const UserModel = require('./models/User')

const UserHandler = require('./handler/UserHandler')
const ScheduleHandler = require('./handler/ScheduleHandler')

require('dotenv').config()

app.use(bodyParser())

var whitelist = ['https://kjr.kampustsl.id', 'http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
 
app.use(cors())

app.use('/user', UserHandler)
app.use('/schedule', ScheduleHandler)

app.listen(5000, () => {
  console.log("Server running");
})