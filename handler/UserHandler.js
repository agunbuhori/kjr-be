const app = require('express')
const UserHandler = app.Router()
const cors = require('cors')
const corsOptions = require('../corsOptions')
const User = require('../models/User')
const Schedule = require('../models/Schedule')
const { makeid, toTitleCase } = require('../helpers')
const QRCode = require('qrcode')
const mailer = require('../config/mailer')
const authorize = require('../config/authorize')
const { succesHandler, errorHandler } = require('./handler')
const ScheduleModel = require('../models/Schedule')

UserHandler.use(cors(corsOptions))

UserHandler.post('/register', async (req, res) => {
  const check = await User.find({ schedule_id: req.body.schedule_id, email: req.body.email }).exec()

  if (check.length === 0) {
    const newUser = new User({ ...req.body, code: makeid(5), name: toTitleCase(req.body.name) })
    const newUserSave = await newUser.save()

    const dec1 = req.body.gender === 'Ikhwan' ? 'male_quota' : 'female_quota'
    await ScheduleModel.findOneAndUpdate({slug: req.body.schedule_id}, {
      $inc: {[dec1]: -1}
    }).exec()

    if (newUserSave && req.body.name_2 && req.body.age_2 && req.body.gender_2) {
      const { name_2, age_2, gender_2 } = req.body
      const otherUser = new User({ ...req.body, code: makeid(5), name: toTitleCase(name_2), age: age_2, gender: gender_2 })
      const otherUserSave = await otherUser.save()

      const dec2 = req.body.gender_2 === 'Ikhwan' ? 'male_quota' : 'female_quota'
      await ScheduleModel.findOneAndUpdate({slug: req.body.schedule_id}, {
        $inc: {[dec2]: -1}
      }).exec()

      res.send(succesHandler({ ...newUserSave.toObject(), other: otherUserSave.toObject() }))
    }

    res.send(succesHandler(newUserSave))
  } else {
    res.send(errorHandler('Antum sudah melakukan registrasi'))
  }
})

function getQR(string) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(string, { type: 'terminal' }, (err, src) => {
      if (err) reject(err)
      resolve(src)
    })
  })
}

function getSchedule(slug) {
  return new Promise((resolve, reject) => {
    Schedule.findOne({ slug }, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

function sendMail(target, data, attachments = [], other = null) {
  return new Promise((resolve, reject) => {
    let template = `<p>
    بسم الله <br/>
    Ahlan, <strong>${data.user.name}!</strong> <br/>
    Berikut QR Code dan bukti pendaftaran untuk <strong>${data.schedule.name}</strong><br/>
    Tempat : ${data.schedule.location}<br/>
    Tanggal : ${data.schedule.datetime}<br/>
    </p>
    
    <p>
    Silahkan simpan dan tunjukan QR Code ini pada panitia kajian. <br/>
    بارك الله فيكم 
    </p>
    {OTHER}
    <p>
    <strong>
    Tiket : https://kjr.kampustsl.id/detail/${data.user._id}<br/>
    Catatan :</strong><br/>
    1. QR Code ini hanya untuk satu orang pendaftar.<br/>
    2. Mari jaga dan lakukan protokol kesehatan.
    </p>
    
    <p>
    Panitia Pendaftaran Kajian  Rutin<br/>
    Yayasan Tarbiyah Sunnah.<br/>
    Helpdesk wa.me/62895377710900
    </p>
        `
    if (other) {
      template = template.replace(
        /\{OTHER\}/,
        `
        <p>Tiket ini terdaftar juga atas nama <strong>${other.name}.</strong></p>
      `
      )
    } else {
      template = template.replace(/\{OTHER\}/, '')
    }
    mailer
      .sendMail({
        from: 'support@kampustsl.id',
        to: target,
        attachments,
        subject: `Bukti Pendaftaran Kajian Rutin ${data.schedule.name}`,
        html: template,
      })
      .then(async (err, sent) => {
        await User.updateMany({ email: data.user.email, schedule_id: data.user.schedule_id }, { mail_confirmed: new Date() })
        resolve(sent)
      })
  })
}

UserHandler.get('/:id', (req, res) => {
  User.findById(req.params.id)
    .then(async (user) => {
      const qrcode = await getQR(user._id.toString())
      const schedule = await getSchedule(user.schedule_id)
      let other = await User.findOne({ email: user.email, schedule_id: user.schedule_id, code: { $ne: user.code } }).exec()

      const attachments = [
        {
          filename: user.code + ' ' + user.name.concat('.png'),
          path: qrcode,
        },
      ]

      if (other) {
        const other_qrcode = await getQR(other._id.toString())
        other = { ...other.toObject(), qrcode: other_qrcode }
        attachments.push({
          filename: other.code + ' ' + other.name.concat('.png'),
          path: other_qrcode,
        })
      }

      if (!user.mail_confirmed) {
        sendMail(user.email, { schedule, user }, attachments, other)
      }

      if (!user.wa_confirmed && req.query.wa) {
        await User.updateMany({ email: user.email, schedule_id: user.schedule_id }, { wa_confirmed: req.query.wa.replace(/@.*$/, '') }).exec()
      }

      res.send(succesHandler({ ...user.toObject(), qrcode, schedule, other }))
    })
    .catch((err) => {
      res.status(404).send(errorHandler(err))
    })
})

UserHandler.post('/scan/:id', authorize, (req, res) => {
  User.findById(req.params.id)
    .then(async (user) => {
      await User.findByIdAndUpdate(req.params.id, { present: new Date(), device: req.body.device })

      res.send(succesHandler(user))
    })
    .catch((err) => {
      res.status(404).send(errorHandler(err))
    })
})

UserHandler.post('/code-scan', authorize, (req, res) => {
  User.findOne({ code: req.body.code, schedule_id: req.body.schedule_id })
    .then(async (user) => {
      await User.findOneAndUpdate({ code: req.body.code, schedule_id: req.body.schedule_id }, { present: new Date(), device: req.body.device })

      res.send(succesHandler(user))
    })
    .catch((err) => {
      res.status(404).send(errorHandler(err))
    })
})

module.exports = UserHandler
