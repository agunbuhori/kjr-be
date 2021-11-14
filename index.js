const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const UserModel = require('./models/User')
var QRCode = require('qrcode')

require('dotenv').config()

app.use(bodyParser())
app.use(cors({
  origin: 'http://localhost:3000'
}))

app.get('/', (req, res) => {
  UserModel.find({}).exec((err, result) => {
    res.send(result)
  });
  // res.send("Http server works")
})

app.get('/tc', (req, res) => {
  UserModel.deleteMany({}).exec();
  res.send('tc')
})

app.post('/register', (req, res) => {
  const user = new UserModel({...req.body});
  user.save()
    .then(result => res.send({
      status: 'success',
      message: result._id
    }))
    .catch(err => res.send({status: 'error', message: err}));
})

app.get('/qr', (req, res) => {
  UserModel.findById(req.query.s, (err, result) => {
    if (err) res.send({status: 'error', message: 'Tidak valid'})

    QRCode.toDataURL(req.query.s, {type:'terminal'}, function (err, src) {
      if (err) res.send("Error occured");
    
      res.send({status: 'success', image: src, message: result})
    });
  })

  
});

app.post('/scan', (req, res) => {
  UserModel.findById(req.body.id).exec((err, result) => {
    if (err) res.send({status: 'error', message: 'User not found'});

    res.send({status: 'success', message: result});
  })
});

app.get('/detail/:id', (req, res) => {
  UserModel.findById(req.params.id, (err, result) => {
    if (err) res.send({status: 'error', message: 'User not found'});

    res.send({status: 'success', message: result});
  })
})

app.listen(5000, () => {
  console.log("Server running");
})