const mongoose = require('mongoose')
const db = require('../config/mongoose')

const Schema = mongoose.Schema

const Schedule = new Schema({
  uid: String,
  name: String,
  facilitator: String,
  location: String,
  datetime: String,
}, {
  timestamps: true
})

const ScheduleModel = db.model('ScheduleModel', Schedule)

module.exports = ScheduleModel