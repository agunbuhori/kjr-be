require('dotenv').config()



var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/kjr-mongo-v2';

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then((msg) => {
  console.log(msg)
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db