const app = require('express')
const responseHandler = require('./responseHandler')
const errorHandler = require('./errorHandler')
const UserModel = require('../models/User')
const ScheduleModel = require('../models/Schedule')
const QRCode = require('qrcode')
const UserHandler = app.Router()
const cors = require('cors')
const nodemailer = require('nodemailer')

const corsOptions = require('../corsOptions')

const corsMiddleware = cors()

UserHandler.use(cors())

function toTitleCase(str) {
  if (!str) return ''
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: 'smtp.gmail.com',
  auth: {
    user: 'support@kampustsl.com',
    pass: 'vmubctmylsqpvidg',
  },
  secure: true,
  tls: {
    ciphers: 'SSLv3',
  },
})

UserHandler.get('/tc', (req, res) => {
  UserModel.deleteMany({}).exec((err, result) => {
    res.send('TC SUC')
  })
})

UserHandler.get('/list', corsMiddleware, (req, res) => {
  UserModel.find({})
    .limit(5)
    .exec((err, result) => {
      if (err) res.send(errorHandler(err))

      res.send(responseHandler(result))
    })
})

UserHandler.post('/register', (req, res) => {
  UserModel.find({email: req.body.email, schedule_id: req.body.schedule_id}, (err, result) => {
    if (result.length === 0) {
      const user = new UserModel({ ...req.body })
      user
        .save()
        .then((result) => res.send(responseHandler(result)))
        .catch((err) => res.send(errorHandler(err)))
    } else {
      res.send(errorHandler("twice registration"))

    }
  })

})

UserHandler.get('/detail/:id', corsMiddleware, (req, res) => {
  UserModel.findById(req.params.id, (err, result) => {
    if (err) res.send(errorHandler(err))

    res.send(responseHandler(result))
  })
})

UserHandler.get('/scan/:id', corsMiddleware, (req, res) => {
  UserModel.findById(req.params.id, async (err, result) => {
    if (err) res.send(errorHandler(err))

    await UserModel.findOneAndUpdate(result._id, { present: true }).exec()

    res.send(responseHandler(result))
  })
})

UserHandler.get('/qr', corsMiddleware, (req, res) => {
  UserModel.findById(req.query.s, (err, result) => {
    if (err) res.send(errorHandler(err))

    QRCode.toDataURL(req.query.s, { type: 'terminal' }, function (err, src) {
      if (err) res.send(errorHandler(err))

      ScheduleModel.findOne({ slug: result.schedule_id }, (err, schedule) => {
        if (err) res.send(errorHandler(err))

        if (! result.confirmed) {
          transporter.sendMail(
            {
              from: 'support@kampustsl.com',
              to: result.email,
              subject: `Bukti Pendaftaran Kajian Rutin ${schedule.name}`,
              attachments: [
                {
                  filename: 'qrcode.png',
                  path: src,
                },
              ],
              html: `
  بسم الله
  <p>
  Ahlan <strong>${toTitleCase(result.name)}!</strong><br/>
  Berikut QR Code dan bukti pendaftaran : <br/>
  Tempat : ${schedule.location}<br/>
  Tanggal : ${schedule.datetime}<br/>
  Silahkan simpan dan tunjukan QR Code ini pada panitia kajian.<br/>
  بارك الله فيكم
  </p>
  <p>
  <strong>Catatan :</strong><br/>
  1. QR Code ini hanya untuk satu orang pendaftar.<br/>
  2. Mari jaga dan lakukan protokol kesehatan.<br/>
  </p>
  <p>
  Panitia Pendaftaran Kajian  Rutin<br/>
  Yayasan Tarbiyah Sunnah.<br/>
  Helpdesk wa.me/62895377710900
  </p>
          `,
            },
            (err, mailsent) => {
              if (err) res.send(err)

              UserModel.findByIdAndUpdate(result._id, {mail_confirmed: true}).exec()
            }
          )
        }
      })
      res.send({ image: src, ...responseHandler(result) })
    })
  })
})

UserHandler.get('/wa', (req, res) => {
  UserModel.findOne({ id: req.query.s, whatsapp: null }, async (err, result) => {
    if (err) res.send(errorHandler(err))

    await UserModel.findByIdAndUpdate(req.query.s, { wa_confirmed: true, whatsapp: req.query.n })

    ScheduleModel.findOne({ slug: result.schedule_id }, (err, schedule) => {
      if (err) res.send(errorHandler(err))

      QRCode.toDataURL(req.query.s, { type: 'terminal' }, function (err, src) {
        if (err) res.send(errorHandler(err))

        res.send({ image: src, ...responseHandler(result), schedule: schedule })
      })
    })
  })
})

module.exports = UserHandler
