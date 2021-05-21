const config = require('config');           //read the config file
const winston = require('winston');         //log error on console and file

/**
 * Get logger transports based on the config file
 * @returns
 */
function getTransports() {
  let rst = [];
  if (config.has('errorLogger.onConsole') && config.get('errorLogger.onConsole') === true) {
    rst.push(new winston.transports.Console());
  }

  if (config.has('errorLogger.onFile') && config.get('errorLogger.onFile') === true) {
    rst.push(
      new winston.transports.File(
        {
          //get log file from the config file
          filename: config.has('errorLogger.filename') ? config.get('errorLogger.filename') : 'error.log',
          level: 'error'
        }
      )
    );
  }

  return rst;
}

/**
 * setup error logger
 */
const logger = winston.createLogger({
  transports: getTransports()
});

/**
   * Handling unhandled exceptions
   */
logger.on('error', function (error) {
  logger.error(error.message, error);
});

/**
 * Handling unhandled promise exception
 */
process.on('unhandledRejection', (ex) => {
  logger.error(ex.message, ex);
});

/**
 * Handling APIs pipeline exceptions
 * @param {*} error 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = function (error, req, res, next) {
  logger.error(error.message, error);     //log the error
  res.status(500).send('Oops! Somthing failed!');     //send error to the end-point
}