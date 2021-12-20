const app = require('express')
const ScheduleModel = require('../models/Schedule')
const ScheduleHandler = app.Router()
const cors = require('cors')
const corsOptions = require('../corsOptions')
const { getSlug } = require('../helpers')
const authorize = require('../config/authorize')
const UserModel = require('../models/User')
const { errorHandler, succesHandler } = require('./handler')

const corsMiddleware = cors(corsOptions)

ScheduleHandler.use(corsMiddleware)

ScheduleHandler.get('/list', (req, res) => {
  ScheduleModel.find({}, [], { sort: { datetime: 1 } }, (err, result) => {
    if (err) res.send(errorHandler(err))
    res.send(succesHandler(result))
  })
})

ScheduleHandler.get('/channel/:slug', authorize, (req, res) => {
  ScheduleModel.findOne({slug: req.params.slug}, async (err, result) => {
    let males = await UserModel.find({schedule_id: result.slug, gender: 'Ikhwan'}).count()
    let males_present = await UserModel.find({schedule_id: result.slug, gender: 'Ikhwan', present: {$ne: null}}).count()
    let females = await UserModel.find({schedule_id: result.slug, gender: 'Akhwat'}).count()
    let females_present = await UserModel.find({schedule_id: result.slug, gender: 'Akhwat', present: {$ne: null}}).count()
    
    res.send(succesHandler({ males, females, males_present, females_present }))
  })
})

ScheduleHandler.get('/registrant/:slug', authorize, (req, res) => {
  UserModel.find({schedule_id: req.params.slug}, (err, result) => {
    res.send(succesHandler(result))
  })
})


ScheduleHandler.post('/create', (req, res) => {
  const times = new Date(req.body.datetime)
  const schedule = new ScheduleModel({ ...req.body, slug: getSlug(times) })

  schedule
    .save()
    .then((result) => res.send(succesHandler(result)))
    .catch((err) => res.send(errorHandler(err)))
})

ScheduleHandler.get('/:slug', corsMiddleware, (req, res) => {
  ScheduleModel.findOne({ slug: req.params.slug }, ['name', 'location', 'facilitator', 'datetime', 'slug', '-_id', 'male_quota', 'female_quota'], (err, result) => {
    if (err || !result) res.send(errorHandler(err))

    res.send(succesHandler(result))
  })
})

ScheduleHandler.post('/authorize/:id', authorize, (req, res) => {
  ScheduleModel.findById(req.params.id, (err, result) => {
    if (err || !result) res.send(errorHandler(err))

    res.send(succesHandler(result))
  })
})

module.exports = ScheduleHandler
