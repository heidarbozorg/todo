const todoDB = require('../dp/todo');
const subtasksDB = require('../dp/subtasks');
const { validateGetAll, validateInsert, validateUpdate } = require('./validations/todo');
const {getError} = require('./common');

/**
 * Get all records and it's child
 * @param {*} startIndex
 * @param {*} pageSize 
 * @returns 
 */
module.exports.getAll = async function (startIndex, pageSize) {
    const pagingParams = {
        startIndex: startIndex || 0,
        pageSize: pageSize || 10
    };

    const { error } = validateGetAll(pagingParams);
    if (error)
        return { status: 400, body: error.details[0].message };

    //Get all master records
    const result = await todoDB.getAll(pagingParams.startIndex, pagingParams.pageSize)
    if (!result || !result.data)
        return getError(result);

    //For each master record, get it's child
    const data = result.data;
    for (var i = 0; i < data.length; i++) {
        const subtasks = await subtasksDB.getAll(data[i].id);
        //if there is any child
        if (subtasks && subtasks.data)
            data[i].subtasks = subtasks.data;
    }

    return { status: 200, body: data };
}


/**
 * Call data provider layer for inserting a new todo record
 * @param {*} data 
 * @returns 
 */
module.exports.insert = async function (data) {
    const { error } = validateInsert(data);
    if (error)
        return { status: 400, body: error.details[0].message };

    const result = await todoDB.insert(data.title);
    if (result && result.data)
        return { status: 201, body: result.data };
    else
        return getError(result);
}

/**
 * Call data provider layer for updating a todo record and it's child
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
module.exports.update = async function (id, data) {
    data.id = id;

    //validate before call go to the data provider layer
    const { error } = validateUpdate(data);
    if (error)
        return { status: 400, body: error.details[0].message };

    const result = await todoDB.update(data.id, data.status);
    if (result && result.data)
        return { status: 204, body: null };
    else
        return getError(result);
}