const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'dev';
}
const env = require('../config/' + process.env.NODE_ENV + '.json');

const Slot = require('../models/user.model');
const User = require('../models/user.model');
const slotController = require('../controllers/slot');

describe('Slot Controller', function () {
    before(function (done) {
        mongoose.connect(`mongodb://${process.env.CALENDLY_DB_USER}:${process.env.CALENDLY_DB_PASSWORD}@${env.testDb.url}:${env.testDb.port}/${env.testDb.databaseName}`)
            .then(result => {
                const user = new User({
                    email: 'test@test.com',
                    password: 'tester',
                    name: 'Test',
                    _id: '5c0f66b979af55031b34728a'
                });
                return user.save();
            })
            .then(() => {
                done();
            });
    });

    it('should add solts', function (done) {
        const req = {
            body: {
                slots: [{
                        start_time: "2020-04-03T10:00:00.000Z",
                        end_time: "2020-04-03T11:00:00.000Z"
                    },
                    {
                        start_time: "2020-04-03T11:00:00.000Z",
                        end_time: "2020-04-03T12:00:00.000Z"
                    }
                ]
            },
            userId: '5c0f66b979af55031b34728a'
        };
        const res = {
            status: function () {
                return this;
            },
            json: function () {}
        };

        slotController.create(req, res, () => {}).then(result => {
            expect(result).to.have.property('result');
            expect(result.result).to.have.length(2);
            done();
        }).catch(err => {
            console.log(err);

        })
    });

    it('should return list of solts', function (done) {
        const req = {
            query: {
                user_id: '5c0f66b979af55031b34728a',
                date: '2020-04-03'
            }
        };
        const res = {
            status: function () {
                return this;
            },
            json: function () {}
        };

        slotController.list(req, res, () => {}).then(result => {
            expect(result).to.have.property('list');
            expect(result.list).to.have.length(2);
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
            });
    });
});