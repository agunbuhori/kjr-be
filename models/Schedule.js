const mongoose = require('mongoose')
const db = require('../config/mongoose')

const Schema = mongoose.Schema

const Schedule = new Schema({
  uid: String,
  name: String,
  datetime: Date
}, {
  timestamps: true
})

const ScheduleModel = db.model('UserModel', Schedule)

module.exports = ScheduleModel