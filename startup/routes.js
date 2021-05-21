//Pushing unhandled errors to our middleware for handle APIs pipleline errors
require('express-async-errors');

const express = require('express');
const todo = require('../routes/todo');
const subtasks = require('../routes/subtasks');
const apiLogger = require('../middleWares/apiLogger');       //Log APIs inputs, timestamp

const errorHandler = require('../middleWares/errorHandler');  //Handle routers error

/**
 * Setup routing apis
 * @param {*} app 
 */
module.exports = function(app) {
    //Setup API logger. Each request will be logged.
    apiLogger(app);

    app.use(express.json());

    //Setup routes
    app.use('/api/todo', todo);
    app.use('/api/subtask', subtasks);

    app.use(errorHandler);      //Handling APIs pipeline exceptions
                                //and Promise rejections
                                //and unhandled exceptions
}