const Joi = require('joi');

/**
 * Validate data for insert
 * @param {*} data 
 * @returns 
 */
module.exports.validateInsert = function(data) {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        todo_id: Joi.number().min(1).required()
    });

    return schema.validate(data);
}

/**
 * Validate data for update
 * @param {*} data 
 * @returns 
 */
module.exports.validateUpdate = function(data) {
    const schema = Joi.object({
        id: Joi.number().min(1).required(),
        status: Joi.number().min(0).max(1).required()
    });

    return schema.validate(data);
}