const config = require('config');
require('./startup/config')();              //Validate required values in the config file

const express = require('express');
const app = express();
require('./startup/routes')(app);           //Setup APIs routes

module.exports = app;