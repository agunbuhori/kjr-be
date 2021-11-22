const app = require('express')
const responseHandler = require('./responseHandler')
const errorHandler = require('./errorHandler')
const ScheduleModel = require('../models/Schedule')
const ScheduleHandler = app.Router()
const cors = require('cors')
const corsOptions = require('../corsOptions')
const { getSlug } = require('../helpers')
const authorize = require('../config/authorize')

const corsMiddleware = cors(corsOptions)

ScheduleHandler.get('/list', authorize, (req, res) => {
  ScheduleModel.find({}, [], {sort: {datetime: 1}}, (err, result) => {
    if (err) res.send(errorHandler(err))

    res.send(responseHandler(result))
  })
})

ScheduleHandler.post('/create', authorize, (req, res) => {
  const times = new Date(req.body.datetime)
  const schedule = new ScheduleModel({ ...req.body, slug: getSlug(times) })

  schedule
    .save()
    .then((result) => res.send(responseHandler(result)))
    .catch((err) => res.send(errorHandler(err)))
})

ScheduleHandler.get('/:slug', corsMiddleware, (req, res) => {
  ScheduleModel.findOne({ slug: req.params.slug, datetime: {$gte: (new Date).toISOString()} }, (err, result) => {
    if (err || !result) res.send(errorHandler(err))

    res.send(responseHandler(result))
  })
})

module.exports = ScheduleHandler
