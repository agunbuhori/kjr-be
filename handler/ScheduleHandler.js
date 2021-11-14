const app = require('express');
const responseHandler = require('./responseHandler');
const errorHandler = require('./errorHandler');
const ScheduleModel = require('../models/Schedule');
const ScheduleHandler = app.Router()

ScheduleHandler.post('/create', (req, res) => {
  const schedule = new ScheduleModel({...req.body});
  
  schedule.save()
  .then(result => res.send(responseHandler(result)))
  .catch(err => res.send(errorHandler(err)));
});

ScheduleHandler.get('/detail/:id', (req, res) => {
  ScheduleModel.findById(req.params.id, (err, result) => {
    if (err) res.send(responseHandler(result));
    
    res.send(responseHandler(result))
  });
});

module.exports = ScheduleHandler
