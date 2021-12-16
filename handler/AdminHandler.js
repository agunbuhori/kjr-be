const app = require('express')
const AdminHandler = app.Router()
const jwt = require('jsonwebtoken')
const { errorHandler, succesHandler } = require('./handler')
const Schedule = require('../models/Schedule')
const User = require('../models/User')
const authorizeAdmin = require('../config/authorizeAdmin')
const { getSlug } = require('../helpers')

const USERNAME = "kjr"
const PASSWORD = "Kjr2021!!!"

AdminHandler.get('/test', (req, res) => {
  User.find({}).limit(1).exec((err, result) => {
    res.send(result)
  })
})
AdminHandler.post('/login', (req, res) => {
  if (req.body.username === USERNAME && req.body.password === PASSWORD) {
    const token = jwt.sign({username: req.body.username}, "TSLKJRAmanLoremIpsum");
    res.send(succesHandler({
      token
    }))
  }

  res.send(errorHandler("Auth failed"))
})

AdminHandler.get('/schedules', authorizeAdmin , (req, res) => {
  Schedule.find().sort({'datetime': -1}).exec((err, result) => {
    res.send(succesHandler(result))
  })
})

AdminHandler.post('/create', authorizeAdmin, (req, res) => {
  const times = new Date(req.body.datetime)
  const schedule = new Schedule({ ...req.body, slug: getSlug(times) })

  schedule
    .save()
    .then((result) => res.send(succesHandler(result)))
    .catch((err) => res.send(errorHandler(err)))
})

AdminHandler.delete('/:id', authorizeAdmin, (req, res) => {
  Schedule.findByIdAndDelete(req.params.id).exec((err, result) => {
    res.send(succesHandler("Success"))
  })
})

AdminHandler.get('/:slug/user', authorizeAdmin, (req, res) => {
  User.where({schedule_id: {$eq: req.params.slug}}).exec((err, result) => {
    res.send(succesHandler(result))
  })
})

AdminHandler.get('/info', authorizeAdmin , async (req, res) => {
  const schedules_active = await Schedule.where({datetime: {$gte: new Date()}}).count()
  const schedules = await Schedule.count()
  const males = await User.where({gender: {$eq: 'Ikhwan'}}).count()
  const females = await User.where({gender: {$eq: 'Akhwat'}}).count()

  res.send(succesHandler({males, females, schedules_active, schedules}))
})


module.exports = AdminHandler