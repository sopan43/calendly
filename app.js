const express = require('express');
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

app.listen(port, () => {
    console.log('Connection Established At PORT:', port);
});