const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'dev';
}
const env = require('../config/' + process.env.NODE_ENV + '.json');

const Slot = require('../models/slot.model');
const User = require('../models/user.model');
const calenderController = require('../controllers/calender');

let slotId = null;

describe('Calender Controller', function () {
    before(function (done) {
        mongoose.connect(`mongodb://${process.env.CALENDLY_DB_USER}:${process.env.CALENDLY_DB_PASSWORD}@${env.testDb.url}:${env.testDb.port}/${env.testDb.databaseName}`)
            .then(result => {
                const user1 = new User({
                    email: 'test@test.com',
                    password: 'tester',
                    name: 'Test',
                    _id: '5c0f66b979af55031b34728a'
                });
                const user2 = new User({
                    email: 'test1@test.com',
                    password: 'tester',
                    name: 'Test',
                    _id: '5e888d2ff371e40017f699da'
                });
                let user = [user1, user2];
                return User.create(user);
            })
            .then(() => {
                const slot = new Slot({
                    user_id: '5c0f66b979af55031b34728a',
                    start_time: "2020-04-03T10:00:00.000Z",
                    end_time: "2020-04-03T11:00:00.000Z",
                    created_by: '5c0f66b979af55031b34728a',
                    booking_id: '20200405123',
                    _id: '5e870f336270a265d2245566'
    
                })
               return slot.save();
            })
            .then(() => {
                done();
            })
            .catch(err => {
                console.log("----------------", err);
                done();
            })
    });

    it('should give error', function (done) {
        const req = {
            body: {
                booking_id: '20200405123aaaaa'
            },
            userId: '5c0f66b979af55031b34728a'
        }
        const res = {
            status: function () {
                return this;
            },
            json: function () {}
        };

        calenderController.addEvent(req, res, () => {}).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('message', 'You dont habe access to booking or invalid booking id.');
            expect(result).to.have.property('statusCode', 422);
            done();
        }).catch(err => {
            console.log(err);
        })
    });

    it('should give message Added to calender', function (done) {
        const req = {
            body: {
                booking_id: '20200405123'
            },
            userId: '5c0f66b979af55031b34728a'
        }
        const res = {
            status: function () {
                return this;
            },
            json: function () {}
        };
        calenderController.addEvent(req, res, () => {}).then(result => {
            expect(result).to.have.property('message', 'Added to calender');
            done();
        }).catch(err => {
            console.log(err);
        })
    });

    after(function (done) {
        Slot.deleteMany({})
            .then(() => {
                return User.deleteMany({})
            })
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            })
    });
});