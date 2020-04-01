'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slotsDetailSchema = new Schema({
  start_time:{
    type: String,
    required: true
  },
  end_time: {
    type: String,
    required: true
  },
  is_available: {
    type: Boolean,
    default: true
  },
  booked_by: {
    type: String
  }
});

const schema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  date: {
      type: Date,
      required:true
  },
  slots: [slotsDetailSchema],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {collection: 'slot'});


module.exports = mongoose.model('slot', schema);
