const app = require('./app');
const http = require('http');
const config = require('config');

const port = config.get('port');            //Read port number from the config file
http.createServer(app).listen(port, () => { 
    console.log(`start listening to port ${port} ...`) ;
});
