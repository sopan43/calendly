'use strict';

const express = require('express');

const slotController = require('../controllers/slot');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post(
  '/create', isAuth ,slotController.create
);

module.exports = router;
