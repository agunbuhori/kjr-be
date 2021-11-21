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
const mailer = require('../config/mailer')

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

function sendMail(target, data, attachments) {
  return new Promise((resolve, reject) => {
    mailer.sendMail({
      from: 'support@kampustsl.id',
      to: target,
      subject: `Bukti Pendaftaran Kajian Rutin ${data.schedule.name}`,
      html: `<p>
  بسم الله <br/>
  Ahlan ${data.user.name} <br/>
  Berikut QR Code dan bukti pendaftaran untuk <strong>${data.schedule.name}</strong><br/>
  Tempat : ${data.schedule.location}<br/>
  Tanggal : ${data.schedule.datetime}<br/>
  </p>
  
  <p>
  Silahkan simpan dan tunjukan QR Code ini pada panitia kajian. <br/>
  بارك الله فيكم 
  </p>
  
  <p>
  <strong>Catatan :</strong><br/>
  1. QR Code ini hanya untuk satu orang pendaftar.<br/>
  2. Mari jaga dan lakukan protokol kesehatan.
  </p>
  
  <p>
  Panitia Pendaftaran Kajian  Rutin<br/>
  Yayasan Tarbiyah Sunnah.<br/>
  Helpdesk wa.me/62895377710900
  </p>
      `
    }).then((err, sent) => {
      resolve(sent)
    })
  })
}

UserHandler.get('/:id', (req, res) => {
  User.findById(req.params.id).then(async (user) => {
    const qrcode = await getQR(user._id.toString())
    const schedule = await getSchedule(user.schedule_id)
    let other = await User.findOne({email: user.email, schedule_id: user.schedule_id, name: {$ne: user.name}}).exec()

    const attachments = [
      {
        filename: user.name.concat('.png'),
        path: qrcode
      }
    ]

    if (other) {
      const other_qrcode = await getQR(other._id.toString())
      other = {...other.toObject(), qrcode: other_qrcode}
      attachments.push({
        filename: other.name.concat('.png'),
        path: other_qrcode
      })
    }

    sendMail(user.email, {schedule, user}, attachments)

    res.send(responseHandler({...user.toObject(), qrcode, schedule, other}))
  }).catch(err => {
    res.status(404).send(errorHandler(err))
  })
})

module.exports = UserHandler
