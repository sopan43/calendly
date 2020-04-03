'use strict';

const Slot = require('../models/slot.model');

const randomize = require('randomatic');

const {
    validationResult
} = require('express-validator/check');

exports.create = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    let slots = new Array();;
    req.body.slots.forEach(slot => {
        slots.push(new Slot({
            ...slot,
            user_id: req.userId
        }))
    });

    return  Slot.create(slots)
        .then(result => {
              res.status(201).json({
                result: result
            });
            return {
                result: result
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.list = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let limit = parseInt(req.query.limit) || 10,
        skip = parseInt(req.query.page) || 1,
        filter = {
            $and: [{
                user_id: req.query.user_id
            }, {
                start_time: { $gte: req.query.date }
            }, {
                is_available: true
            }]
        },
        result = {
            count: 0,
            list: []
        };

    return Slot.count(filter)
        .exec()
        .then(docCount => {
            result.count = docCount;
            return Slot.find(filter)
                .skip((skip - 1) * limit)
                .limit(limit)
                .exec();
        })
        .then(docs => {
            result.list = docs;
            res.status(200).json(result);
            return result
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.book = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let filter = {
        _id: req.body.slot_id,
        is_available: true
    };
    let currentDate = new Date(),
        bookingId = currentDate.getFullYear().toString() + currentDate.getMonth().toString() + currentDate.getDate().toString() + randomize('0', 3).toString();

    let update = {
        is_available: false,
        updated_at: currentDate,
        booked_by: req.userId,
        booking_id: bookingId
    }

    Slot.findOneAndUpdate(filter, update, {
            new: true
        }).exec()
        .then(result => {
            if (!result) {
                const error = new Error('No avaliable slot found');
                error.statusCode = 422;
                error.data = errors.array();
                throw error;
            }
            res.status(200).json({
                message: 'Booking Done',
                result: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}