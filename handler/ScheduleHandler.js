const app = require('express')
const responseHandler = require('./responseHandler')
const errorHandler = require('./errorHandler')
const ScheduleModel = require('../models/Schedule')
const ScheduleHandler = app.Router()
const cors = require('cors')
const corsOptions = require('../corsOptions')
const { getSlug } = require('../helpers')
const authorize = require('../config/authorize')
const UserModel = require('../models/User')
const authorizeAdmin = require('../config/authorizeAdmin')

const corsMiddleware = cors(corsOptions)

ScheduleHandler.use(corsMiddleware)

ScheduleHandler.get('/list', authorize, (req, res) => {
  ScheduleModel.find({}, [], { sort: { datetime: 1 } }, (err, result) => {
    if (err) res.send(errorHandler(err))
    res.send(responseHandler(result))
  })
})

ScheduleHandler.get('/channel/:id', authorize, (req, res) => {
  ScheduleModel.findById(req.params.id, async (err, result) => {
    await UserModel.updateMany({}, {present: 'none'}).exec();
    let males = await UserModel.find({schedule_id: result.slug, gender: 'Ikhwan'}).count()
    let males_present = await UserModel.find({schedule_id: result.slug, gender: 'Ikhwan', present: {$ne: null}}).count()
    let females = await UserModel.find({schedule_id: result.slug, gender: 'Akhwat'}).count()
    let females_present = await UserModel.find({schedule_id: result.slug, gender: 'Akhwat', present: {$ne: null}}).count()
    
    res.send(responseHandler({ males, females, males_present, females_present }))
  })
})

ScheduleHandler.post('/create', (req, res) => {
  const times = new Date(req.body.datetime)
  const schedule = new ScheduleModel({ ...req.body, slug: getSlug(times) })

  schedule
    .save()
    .then((result) => res.send(responseHandler(result)))
    .catch((err) => res.send(errorHandler(err)))
})

ScheduleHandler.get('/:slug', corsMiddleware, (req, res) => {
  ScheduleModel.findOne({ slug: req.params.slug }, ['name', 'location', 'facilitator', 'datetime', 'slug'], (err, result) => {
    if (err || !result) res.send(errorHandler(err))

    res.send(responseHandler(result))
  })
})

ScheduleHandler.post('/authorize/:id', authorize, (req, res) => {
  ScheduleModel.findById(req.params.id, (err, result) => {
    if (err || !result) res.send(errorHandler(err))

    res.send(responseHandler(result))
  })
})

module.exports = ScheduleHandler
