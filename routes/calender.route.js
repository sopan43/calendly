'use strict';

const express = require('express');
const { body } = require('express-validator/check');

const googleCalender = require('../controllers/calender');
const isAuth = require('../middleware/is-auth');
const Slot = require('../models/slot.model');

const router = express.Router();


router.post(
  '/addevent', isAuth, googleCalender.addEvent
);


module.exports = router;