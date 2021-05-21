const Joi = require('joi');

/**
 * Validating paging params
 * @param {*} pagingParams 
 * @returns 
 */
module.exports.validateGetAll = function(pagingParams) {
    const schema = Joi.object({
        startIndex: Joi.number().min(0).required(),
        pageSize: Joi.number().min(1).max(100).required()
    });

    return schema.validate(pagingParams);
}

/**
 * Validating data for insert
 * @param {*} data 
 * @returns 
 */
module.exports.validateInsert = function(data) {
    const schema = Joi.object({
        title: Joi.string().min(3).required()
    });

    return schema.validate(data);
}

/**
 * Validating data for update
 * @param {*} id 
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
