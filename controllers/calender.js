'use strict';

const Booking = require('../models/booking.model');
const User = require('../models/user.model');

const {
    validationResult
} = require('express-validator/check')
const fs = require('fs');
const readline = require('readline');
const {
    google
} = require('googleapis');

const env = require('../config/' + process.env.NODE_ENV + '.json');
let credentials = env.googleAPI;

exports.addEvent = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    let returnObj = {
        message: 'Added to calender'
    }
    credentials.installed.client_id = process.env.CLIENT_ID;
    credentials.installed.client_secret = process.env.CLIENT_SECRET;
    if (credentials.installed.client_secret === undefined || credentials.installed.client_id === undefined) {
        const error = new Error('Google Client not found');
        error.statusCode = 422;
        throw error;
    }
    let booking;
    return Booking.find({
            booking_id: req.body.booking_id}).lean().exec()
        .then(bookingObj => {
            if (bookingObj.length === 0) {
                const error = new Error('Invalid booking id.');
                error.statusCode = 422;
                throw error;
            }
            let user = bookingObj[0].attendees.find(attendee=> attendee.user_id = req.userId)            
            if(user === undefined) {
                const error = new Error('You dont habe access to booking.');
                error.statusCode = 422;
                throw error;
            }
            booking = bookingObj[0];
            let attendee = bookingObj[0].attendees.map(attendee => {return {_id: attendee.user_id}});
            return User.find({
                $or: attendee
            })
        })
        .then(attendees => {
            booking.attendees = attendees;
            return authorize(credentials);
        })
        .then(auth => {            
            return addEvent(auth, booking)
        })
        .then(event => {
           res.status(200).json(returnObj);
           return returnObj;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
            return err
        });
};

function authorize(credentials) {
    return new Promise((resolve, reject) => {
        const {
            client_secret,
            client_id,
            redirect_uris
        } = credentials.installed;

        let token = {
            access_token: process.env.ACCESS_TOKEN,
            refresh_token: process.env.REFRESH_TOKEN,
            token_type: process.env.TOKEN_TYPE,
            expiry_date: process.env.EXPIRY_DATE,
            scope: process.env.SCOPE
        }
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        if (token.access_token !== undefined && token.refresh_token !== undefined && token.token_type !== undefined && token.expiry_date !== undefined && token.scope !== undefined) {

            oAuth2Client.setCredentials(token);
            resolve(oAuth2Client)
        } else {
            const error = new Error('Token not found, Please contact admin');
            error.statusCode = 422;
            reject(error)

        }
    })

}

function addEvent(auth, booking) {
    var event = getEventObj(booking)
    const calendar = google.calendar({
        version: 'v3',
        auth
    });
    return new Promise((resolve, reject) => {
        calendar.events.insert({
            auth: auth,
            calendarId: 'primary',
            sendNotifications: true,
            resource: event,
        }, function (err, event) {
            if (err) {
                const error = new Error('There was an error contacting the Calendar service: ' + err);
                error.statusCode = 422;
                reject(error);
            }
            resolve('Event created: ', event);
        });
    })

}

function getEventObj(booking) {
    let returnObj = {
        'summary': 'Your upcomming meetings',
        'description': `You have a meeting schedule with`,
        'start': {
            'dateTime': booking.start_time,
            'timeZone': 'Asia/Calcutta',
        },
        'end': {
            'dateTime': booking.end_time,
            'timeZone': 'Asia/Calcutta',
        },
        'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=2'
        ],
        'attendees': [],
        'reminders': {
            'useDefault': 'useDefault'
        }
    };

    booking.attendees.forEach(attende => {
        returnObj.attendees.push({
            'email': attende.email,
            'sendNotifications': true
        });
    });
    return returnObj;
}