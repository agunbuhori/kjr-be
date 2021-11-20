const mongoose = require('mongoose')
const db = require('../config/mongoose')

const Schema = mongoose.Schema

const User = new Schema({
  uid: String,
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
    type: Boolean,
    default: false
  },
  mail_confirmed: {
    type: Boolean,
    default: false
  },
  
  wa_confirmed: {
    type: Boolean,
    default: false
  },

  
  whatsapp: {
    type: String
  },
  ticket: Number,
  schedule_id: String,
  name_2: String,
  gender_2: String,
  age_2: Number,

}, {
  timestamps: true
})

const UserModel = db.model('UserModel', User)

module.exports = UserModel