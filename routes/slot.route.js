'use strict';

const express = require('express');
const { query } = require('express-validator/check');

const slotController = require('../controllers/slot');
const isAuth = require('../middleware/is-auth');
const checkTime = require('../middleware/checkTime');
const User = require('../models/user.model');

const router = express.Router();

router.post(
  '/create', [isAuth, checkTime], slotController.create
);

router.get(
  '/slots/list', [isAuth, query('user_id').custom((value, {
    req
  }) => {
    return User.findById({
      _id: value
    }).then(userDoc => {
      if (!userDoc) {
        return Promise.reject('User doesnot exists!');
      }
    });
  })], slotController.list
);

router.put(
  '/book', [isAuth], slotController.book
);

module.exports = router;