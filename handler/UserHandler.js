const app = require('express');
const responseHandler = require('./responseHandler');
const errorHandler = require('./errorHandler');
const UserModel = require('../models/User');
const ScheduleModel = require('../models/Schedule');
const QRCode = require('qrcode');
const UserHandler = app.Router()
const cors = require('cors')
const nodemailer = require('nodemailer');

const corsOptions = require('../corsOptions');

const corsMiddleware = cors()

UserHandler.use(cors())

const transporter = nodemailer.createTransport({
  port: 587,               // true for 465, false for other ports
  host: "smtp.gmail.com",
     auth: {
          user: 'support@kampustsl.com',
          pass: 'vmubctmylsqpvidg',
       },
    secure: true,
  });


UserHandler.get('/tc', (req, res) => {
  UserModel.deleteMany({}).exec((err, result) => {
    res.send("TC SUC");
  });
});

UserHandler.get('/list', corsMiddleware, (req, res) => {
  UserModel.find({}).limit(5).exec((err, result) => {
    if (err) res.send(errorHandler(err))

    res.send(responseHandler(result))
  });
});

UserHandler.post('/register', (req, res) => {
  const user = new UserModel({...req.body});
  user.save()
    .then(result => res.send(responseHandler(result)))
    .catch(err => res.send(errorHandler(err)));
})

UserHandler.get('/detail/:id', corsMiddleware, (req, res) => {
  UserModel.findById(req.params.id, (err, result) => {
    if (err) res.send(errorHandler(err))

    res.send(responseHandler(result))
  })
});

UserHandler.get('/qr', corsMiddleware, (req, res) => {
  UserModel.findById(req.query.s, (err, result) => {
    if (err) res.send(errorHandler(err))

      QRCode.toDataURL(req.query.s, {type:'terminal'}, function (err, src) {
        if (err) res.send(errorHandler(err));

        transporter.sendMail({from: 'support@kampustsl.com', to: result.email, subject: `Bukti Pendaftaran Kajian Rutin`, html: `
بسم الله
Ahlan ${result.name}
Berikut QR Code dan bukti pendaftaran
Tempat :
Tanggal :

<img src="${src}"/>

Silahkan simpan dan tunjukan QR Code ini pada panitia kajian.
بارك الله فيكم

Catatan :
1. QR Code ini hanya untuk satu orang pendaftar.
2. Mari jaga dan lakukan protokol kesehatan.

Panitia Pendaftaran Kajian  Rutin
Yayasan Tarbiyah Sunnah.
Helpdesk wa.me/62895377710900
        `})
  
        res.send({image: src, ...responseHandler(result)})
      });
  });
});

UserHandler.get('/wa', (req, res) => {
  UserModel.findOne({id: req.query.s, whatsapp: null}, async (err, result) => {
    if (err) res.send(errorHandler(err))

    await UserModel.findByIdAndUpdate(req.query.s, {confirmed: true, whatsapp: req.query.n});

    ScheduleModel.findOne({slug: result.schedule_id}, (err, schedule) => {
      if (err) res.send(errorHandler(err))

      QRCode.toDataURL(req.query.s, {type:'terminal'}, function (err, src) {
        if (err) res.send(errorHandler(err));
  
        res.send({image: src, ...responseHandler(result), schedule: schedule})
      });
    });
  });
});

UserHandler.post('/scan', (req, res) => {
  UserModel.findByIdAndUpdate(req.body.id, {present: true}, (err, result) => {
    if (err) res.send(errorHandler(err));
    
    res.send(result)
  })
});

module.exports = UserHandler
