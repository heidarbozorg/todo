const config = require('config');
var fs = require('fs');
var path = require('path')
const morgan = require('morgan');

/**
 * Setup log at file
 * @param {*} app 
 * @param {*} filename - This file will be created at the root of the application
 */
function logAtFile(app, filename) {
    app.use(morgan('common', 
    {
        stream: fs.createWriteStream
        (
            path.join(__dirname, '../' + filename), 
            { flags: 'a' }
        )
    }));
}

/**
 * Setup how to log api requests set at the config file
 * @param {*} app 
 */
module.exports = function(app) {
    //Get the values from the config file
    const onConsole = config.has('apiLogger.onConsole') ? config.get('apiLogger.onConsole') : false;
    const onFile = config.has('apiLogger.onFile') ? config.get('apiLogger.onFile') : false;
    const filename = config.has('apiLogger.filename') ? config.get('apiLogger.filename') : 'requestsTests.log';

    //Setup log
    if (onConsole)
        app.use(morgan('common'));

    if (onFile)
        logAtFile(app, filename);
};