const config = require('config');
require('./startup/config')();              //Validate required values in the config file

const express = require('express');
const app = express();
require('./startup/routes')(app);           //Setup APIs routes

/*
const port = config.get('port');            //Read port number from the config file
const server = app.listen(port, () => { 
    console.log(`start listening to port ${port} ...`) ;
});

//module.exports = server;
*/

module.exports = app;