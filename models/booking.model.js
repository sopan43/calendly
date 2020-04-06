'use strict';
const moment = require('moment')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    created_by: {
        type: String,
        required: true
    },
    attendees: {
        type: Array,
        items: {
            user_id: {
                type: String,
                required: true
            }
        }
    },
    booking_id: {
        type: String
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
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
    collection: 'booking'
});


module.exports = mongoose.model('booking', schema);