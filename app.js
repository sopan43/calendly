const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log('Connection Established At PORT:', port);
});