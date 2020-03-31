const express = require('express');
const mongooose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'dev';
}

const env = require('./config/' + process.env.NODE_ENV + '.json');
let port = process.env.PORT || env.port;

app.use(bodyParser.urlencoded({
    extended: false
}));

console.log(env)

//DB setup
mongooose.set('useCreateIndex', true);
// const conn = mongooose.connect(`mongodb://${process.env.CALENDLY_DB_USER}:${process.env.CALENDLY_DB_PASSWORD}@${env.db.url}:${env.db.port}/${env.db.databaseName}`, {useNewUrlParser: true, poolSize: 20}, (err) => {
  //   if (err) {
  //     console.log('Connection error. Mongo Service may be down');
  //     process.exit();
  //   }
  // });

app.listen(port, () => {
    console.log('Connection Established At PORT:', port);
});