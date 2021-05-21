const Joi = require('joi');

/**
 * Validate id
 * @param {*} id must be a number and the minimum value is 1
 * @returns true = is valid,  false = is not valid
 */
module.exports.validateId = function (id) {
    const schema = Joi.object({
        id: Joi.number().min(1).required()
    });

    const rst = schema.validate({id: id});
    if (rst.error)
        return false;
    return true;
}

/**
 * Is database search result valid? Is data exists?
 * @param {*} result 
 * @returns 
 */
module.exports.searchResult = function (result) {
    if (result && result.rowCount && result.rowCount > 0)
        return true;
    return false;
}

/**
 * Validate pageSize for search in database
 * @param {*} pageSize - must be a number between 1..100
 * @returns 
 */
module.exports.pageSize = function (pageSize) {
    const schema = Joi.object({
        pageSize: Joi.number().min(1).max(100).required()
    });

    const rst = schema.validate({pageSize: pageSize});
    if (rst.error)
        return false;
    return true;
}

/**
 * Validate startIndex for search in database
 * @param {*} startIndex - Must be a positive number
 * @returns 
 */
module.exports.startIndex = function (startIndex) {
    const schema = Joi.object({
        startIndex: Joi.number().min(0).required()
    });

    const rst = schema.validate({startIndex: startIndex});
    if (rst.error)
        return false;
    return true;
}