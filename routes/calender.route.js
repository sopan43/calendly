'use strict';

const express = require('express');
const { body } = require('express-validator/check');

const googleCalender = require('../controllers/calender');
const isAuth = require('../middleware/is-auth');
const Slot = require('../models/slot.model');

const router = express.Router();


router.post(
  '/addevent', [isAuth, body('booking_id').custom((value, {
    req
  }) => {
    return Slot.findOne({
        booking_id: value,
        booked_by: req.userId
    }).then(doc => {
      if (!doc) {
        return Promise.reject('You dont have access to this booking!');
      }
    });
  })], googleCalender.addEvent
);


module.exports = router;