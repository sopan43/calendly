'use strict';

const Slot = require('../models/slot.model');
const moment = require('moment')

console.log(Date.now())
console.log(moment().format())

module.exports = (req, res, next) => {
    req.body.slots.forEach(slot => {
        if(slot.start_time > slot.end_time){
            const error = new Error('Start Time Cannot be Greate then End Time');
            error.statusCode = 406;
            throw error;
        }

        if(slot.start_time < moment().format()){
            const error = new Error('Start Time Cannot be Less then Current time');
            error.statusCode = 406;
            throw error;
        }
        
    });
    next();
  };
  