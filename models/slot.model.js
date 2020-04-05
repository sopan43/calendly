'use strict';
const moment = require('moment')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  start_time: {
    type: Date,
    required: true
  },
  end_time: {
    type: Date,
    required: true
  },
  is_available: {
    type: Boolean,
    default: true
  },
  booked_by: {
    type: String
  },
  booking_id: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'slot'
});

schema.post('find', function (result) {
  result.forEach(element => {
    element.start_time = moment(element.start_time).utcOffset("+05:30").format();
  });
});

module.exports = mongoose.model('slot', schema);