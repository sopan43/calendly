'use strict';

const express = require('express');
const { query } = require('express-validator/check');

const slotController = require('../controllers/slot');
const isAuth = require('../middleware/is-auth');
const User = require('../models/user.model');

const router = express.Router();

router.post(
  '/create', isAuth, slotController.create
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

module.exports = router;