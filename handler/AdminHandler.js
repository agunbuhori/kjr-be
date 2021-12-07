const app = require('express')
const jwt = require('jsonwebtoken')
const authorizeAdmin = require('../config/authorizeAdmin')
const ScheduleModel = require('../models/Schedule')
const AdminHandler = app.Router()
const cors = require('cors')
const corsOptions = require('../corsOptions')

const secret = "TSLKJRAmanLoremIpsum"

AdminHandler.use(cors(corsOptions))

AdminHandler.post('/login', (req, res) => {
  const username = "adminkjr"
  const password = "kjr2021!!!"

  if (req.body.username === username && req.body.password === password) {
    const token = jwt.sign({user: 'superadmin'}, secret);
    res.send({
      status: 'success',
      message: token
    })
  }
})

AdminHandler.get('/schedules', authorizeAdmin, async (req, res) => {
  const schedules = await ScheduleModel.find({datetime: {$gte: new Date}}).exec()
  
  res.send(schedules)
})

module.exports = AdminHandler