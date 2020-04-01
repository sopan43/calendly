'use strict';

const jwt = require('jsonwebtoken');

const env = require('../config/' + process.env.NODE_ENV + '.json');

exports.generateToken = (dataObj, options={}) => {
  return jwt.sign(dataObj, env.jwt.secret, options);
};

exports.verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    try {
      let result = jwt.verify(token, env.jwt.secret);
      resolve(result);
    } catch(err) {
      reject(err);
    }
  });
};
