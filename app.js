'use strict';

const express = require('express');
const mongooose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

//Setingup env
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'dev';
}
const env = require('./config/' + process.env.NODE_ENV + '.json');

//config PORT
let port = process.env.PORT || env.port;

const authRoutes = require('./routes/auth.route');
const slotRoutes = require('./routes/slot.route');
const calenderRoutes = require('./routes/calender.route');

//Middlewares
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/slot', slotRoutes);
app.use('/calender', calenderRoutes);

//Error Handling Middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

//DB setup
mongooose.set('useCreateIndex', true);
const conn = mongooose.connect(`mongodb://${process.env.CALENDLY_DB_USER}:${process.env.CALENDLY_DB_PASSWORD}@${env.db.url}:${env.db.port}/${env.db.databaseName}`, {useNewUrlParser: true, poolSize: 20}, (err) => {
    if (err) {
      console.log('Connection error. Mongo Service may be down');
      process.exit();
    }
  });

app.listen(port, () => {
    console.log('Connection Established At PORT:', port);
});