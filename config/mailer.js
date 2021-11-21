const nodemailer = require('nodemailer')

const mailer = nodemailer.createTransport({
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

module.exports = mailer