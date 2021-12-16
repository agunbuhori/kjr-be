require('dotenv').config()



var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/kajianrutin';

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then((msg) => {
  console.log(msg)
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db