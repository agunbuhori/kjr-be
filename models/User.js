const mongoose = require('mongoose')
const db = require('../config/mongoose')

const Schema = mongoose.Schema

const User = new Schema({
  uid: String,
  name: String,
  email: String,
  age: Number,
  phone: String,
  city: String,
  present: {
    type: Boolean,
    default: false
  },
  confirmed: {
    type: Boolean,
    default: false
  },

}, {
  timestamps: true
})

const UserModel = db.model('UserModel', User)

module.exports = UserModel