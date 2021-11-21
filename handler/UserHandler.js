const app = require('express')
const UserHandler = app.Router()
const cors = require('cors')
const corsOptions = require('../corsOptions')
const User = require('../models/User')
const Schedule = require('../models/Schedule')
const { makeid } = require('../helpers')
const responseHandler = require('./responseHandler')
const errorHandler = require('./errorHandler')
const QRCode = require('qrcode')

UserHandler.use(cors(corsOptions))

UserHandler.get('/list', (req, res) => {
  User.find({}, (err, result) => res.send(responseHandler(result)))
})

UserHandler.get('/tc', (req, res) => {
  User.deleteMany({}, (err, result) => res.send(responseHandler(result)))
})

UserHandler.post('/register', async (req, res) => {
  const check = await User.find({schedule_id: req.body.schedule_id}).exec()

  if (check.length === 0) {
    const newUser = new User({...req.body, code: makeid(5, true)})
    const newUserSave = await newUser.save()

    if (newUserSave && req.body.name_2 && req.body.age_2 && req.body.gender_2) {
      const {name_2, age_2, gender_2} = req.body
      const otherUser = new User({...req.body, code: makeid(5, true), name: name_2, age: age_2, gender: gender_2})
      const otherUserSave = await otherUser.save()

      res.send(responseHandler({...newUserSave.toObject(), other: otherUserSave.toObject()}))
    }

    res.send(responseHandler(newUserSave))
  }
})

function getQR(string) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(string, {type: 'terminal'}, (err, src) => {
      if (err) reject(err)
      resolve(src)
    })
  });
}

function getSchedule(slug) {
  return new Promise((resolve, reject) => {
    Schedule.findOne({slug}, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

UserHandler.get('/:id', (req, res) => {
  User.findById(req.params.id).then(async (user) => {
    const qrcode = await getQR(user._id.toString())
    const schedule = await getSchedule(user.schedule_id)
    let other = await User.findOne({email: user.email, schedule_id: user.schedule_id, name: {$ne: user.name}}).exec()
    if (other)
      other = {...other.toObject(), qrcode: await getQR(other._id.toString())}
    res.send(responseHandler({...user.toObject(), qrcode, schedule, other}))
  }).catch(err => {
    res.status(404).send(errorHandler(err))
  })
})

module.exports = UserHandler
