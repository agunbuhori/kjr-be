const mongoose = require('mongoose')
const db = require('../config/mongoose')

const Schema = mongoose.Schema

const Schedule = new Schema({
  uid: String,
  name: String,
  slug: {
    type: String,
    unique: true
  },
  facilitator: String,
  location: String,
  datetime: String,
  male_quota: Number,
  female_quota: Number,
  maps: String
}, {
  timestamps: true
})

const ScheduleModel = db.model('ScheduleModel', Schedule)

module.exports = ScheduleModel