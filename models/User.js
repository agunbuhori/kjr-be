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
  phone: {
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
  confirmed: {
    type: Boolean,
    default: false
  },
  schedule_id: String

}, {
  timestamps: true
})

const UserModel = db.model('UserModel', User)

module.exports = UserModel