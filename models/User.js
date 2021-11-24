const mongoose = require('mongoose')
const db = require('../config/mongoose')

const Schema = mongoose.Schema

const User = new Schema({
  uid: String,
  code: String,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },
  present: {
    type: Date
  },
  mail_confirmed: {
    type: Date
  },
  wa_confirmed: {
    type: String
  },
  whatsapp: {
    type: String
  },
  ticket: Number,
  schedule_id: String,
  device: String

}, {
  timestamps: true
})

const UserModel = db.model('UserModel', User)

module.exports = UserModel