const ctx = require('./ctx');
const validations = require('./validations');

/**
 * Get a record from database by it's primary key
 * @param {*} id 
 * @returns 
 */
 module.exports.getById = async function(id) {
    if (!validations.validateId(id))
        return { data: null, error: 'Invalid id!', errorCode: 400 };

    const sqlCommand =
        `select * from public."Todo" where id = ${id} limit 1;`;

    const result = await ctx.executeQuery(sqlCommand);

    //Check the search result
    if (validations.searchResult(result))
        return { data: result.rows[0], error: '' };

    return { data: null, error: 'Record not found!', errorCode: 404 };
}

/**
 * Get all todo record 
 * @returns 
 */
module.exports.getAll = async function(startIndex, pageSize) {
    if (!validations.pageSize(pageSize) || !validations.startIndex(startIndex))
        return {data: null, error: 'Invalid paging parameters.', errorCode: 400};

    const sqlCommand =
        `select id, title, created_at from public."Todo" order by id limit ${pageSize} offset ${startIndex}`;

    const result = await ctx.executeQuery(sqlCommand);
    if (validations.searchResult(result))
        return { data: result.rows, error: '' };

    return { data: null, error: 'Record not found!', errorCode: 404 };
}

/**
 * Insert a new record to the database
 * @param {*} title 
 * @returns 
 */
module.exports.insert = async function(title) {
    const sqlCommand =
        `INSERT INTO public."Todo" 
        (title) VALUES ('${title}') RETURNING id`;

    const result = await ctx.executeQuery(sqlCommand);
    if (validations.searchResult(result) && result.rowCount === 1)
        return { data: result.rows[0], error: '' };

    //Some unpredictable error occured
    return { data: null, error: 'Oops! Something wrong!', errorCode: 500 };
}

/**
 * Update a todo status and it's childs
 * @param {*} id - Todo primary key
 * @param {*} status - New status
 * @returns 
 */
module.exports.update = async function(id, status) {
    if (!validations.validateId(id))
        return {data: null, error: 'Invalid data', errorCode: 400};

    const sqlCommand =
        `update public."Todo" 
    set status = '${status}'
    where id = ${id};
    update public."Subtasks"
    set status = '${status}'
    where "todo_id" = ${id}`;

    const result = await ctx.executeQuery(sqlCommand);
    if (result && result.length > 0 && result[0].rowCount === 1)
        return { data: result[0].rows, error: '' };

    return { data: null, error: 'Record not found!', errorCode: 404 };
}