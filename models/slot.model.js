'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  start_time:{
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
}, {collection: 'slot'});

schema.pre('save', function(next) {
  let i = 0;
  console.log(i)
  i++
  next();
});

module.exports = mongoose.model('slot', schema);
