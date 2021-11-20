const app = require('express')
const responseHandler = require('./responseHandler')
const errorHandler = require('./errorHandler')
const ScheduleModel = require('../models/Schedule')
const ScheduleHandler = app.Router()
const cors = require('cors')

function formatDate(times) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

  const day = times.getDay()
  const date = times.getDate()
  const month = times.getMonth()
  const year = times.getFullYear()

  return `kajian-${days[day]}-${date}-${months[month]}-${year}`.toLowerCase().concat('-' + makeid(5))
}

function makeid(length) {
  var result = ''
  var characters = '0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

ScheduleHandler.use(cors());

ScheduleHandler.post('/create', (req, res) => {
  const times = new Date(req.body.datetime)
  const slug = formatDate(times)
  const schedule = new ScheduleModel({ ...req.body, slug })

  schedule
    .save()
    .then((result) => res.send(responseHandler(result)))
    .catch((err) => res.send(errorHandler(err)))
})

ScheduleHandler.get('/detail/:slug', (req, res) => {
  ScheduleModel.findOne({ slug: req.params.slug, datetime: {$gte: (new Date).toISOString()} }, (err, result) => {
    if (err || !result) res.send(errorHandler(err))

    res.send(responseHandler(result))
  })
})

ScheduleHandler.get('/first', (req, res) => {
  ScheduleModel.findOne({ datetime: {$gte: (new Date).toISOString()} }, (err, result) => {
    if (err || !result) res.send(errorHandler(err))

    res.send(responseHandler(result))
  })
})


ScheduleHandler.get('/list', (req, res) => {
  ScheduleModel.find({datetime: {$gte: (new Date).toISOString()}}, (err, result) => {
    if (err || !result) res.send(errorHandler(err))

    res.send(responseHandler(result))
  })
})

module.exports = ScheduleHandler
