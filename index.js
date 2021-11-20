const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const UserHandler = require('./handler/UserHandler')
const ScheduleHandler = require('./handler/ScheduleHandler')

require('dotenv').config()

app.use(bodyParser())

app.use('/user', UserHandler)
app.use('/schedule', ScheduleHandler)

app.listen(5000, () => {
  console.log("Server running");
})