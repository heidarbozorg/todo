const subtasks = require('../dp/subtasks');
const { getError } = require('./common');
const { validateInsert, validateUpdate } = require('./validations/subtasks');

/**
 * Insert a new subtask to the database
 * @param {*} data 
 * @returns 
 */
module.exports.insert = async function (data) {
    //Validate data before go to the data provider layer
    if (!data)
        return { status: 400, body: 'Invalid data!' };

    const { error } = validateInsert(data);
    if (error)
        return { status: 400, body: error.details[0].message };

    const result = await subtasks.insert(data.title, data.todo_id);
    if (result && result.data)
        return { status: 201, body: result.data };

    return getError(result);
}

/**
 * Update a subtask and it's parent
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
module.exports.update = async function (id, data) {
    if (!data)
        return { status: 400, body: 'Invalid data!' };

    data.id = id;

    //Validate data before go to the data provider
    const { error } = validateUpdate(data);
    if (error)
        return { status: 400, body: error.details[0].message };

    const result = await subtasks.update(data.id, data.status);
    if (result && result.data)
        return { status: 204, body: null };

    return getError(result);
}