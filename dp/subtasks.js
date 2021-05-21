const ctx = require('./ctx');
const validations = require('./validations');
const todo = require('./todo');

/**
 * Get a specific subtask record by primary key
 * @param {*} id 
 * @returns 
 */
 async function getById(id) {
    if (!validations.validateId(id))
        return { data: null, error: 'Invalid id!', errorCode: 400 };

    const sqlCommand =
        `select * from public."Subtasks" where id = ${id} limit 1;`;

    const result = await ctx.executeQuery(sqlCommand);
    if (validations.searchResult(result))
        return { data: result.rows[0], error: '' };

    return { data: null, error: 'Record not found!', errorCode: 404 };
}

/**
 * Get all a todo subtasks
 * @param {*} todo_id - The todo primary key
 * @returns 
 */
module.exports.getAll = async function(todo_id) {
    if (!validations.validateId(todo_id))
        return {data: null, error: 'Invalid todo_id.', errorCode: 400};

    const sqlCommand =
        `select * from public."Subtasks" where "todo_id" = ${todo_id}`;

    const result = await ctx.executeQuery(sqlCommand);
    if (validations.searchResult(result))
        return { data: result.rows, error: '' };

    return { data: null, error: 'Record not found!', errorCode: 404 };
}

/**
 * Insert a new subsask
 * @param {*} title 
 * @param {*} todo_id 
 * @returns 
 */
module.exports.insert = async function(title, todo_id) {
    //Check is the parent record exists?
    const parent = await todo.getById(todo_id);
    if (parent.data === null)
        return { data: null, error: parent.error || 'Insert failed! Parent record not found.', errorCode: parent.errorCode || 404 };

    const sqlCommand =
        `INSERT INTO public."Subtasks" 
        (title, "todo_id")
        VALUES
        ('${title}', ${todo_id}) RETURNING id`;

    const result = await ctx.executeQuery(sqlCommand);
    if (validations.searchResult(result) && result.rowCount === 1)
        return { data: result.rows[0], error: '' };

    return { data: null, error: 'Oops! Something failed!', errorCode: 500 };
}

/**
 * Update a subtask status and it's parent
 * @param {*} id 
 * @param {*} status 
 * @returns 
 */
module.exports.update = async function(id, status) {
    const subtask = await getById(id);
    if (subtask.data == null)
        return subtask;

    const todo_id = subtask.data.todo_id;

    let sqlCommand =
        `update public."Subtasks" 
    set status = '${status}'
    where id = ${id}; `;

    if (status === 1)
        sqlCommand = sqlCommand +
            `update public."Todo"
        set status = '1'
        where id = ${todo_id}
        and status <> '1'
        and not exists
        (
            select * 
            from public."Subtasks"
            where 
                "todo_id" = ${todo_id} 
                and status <> '1'
        );`;
    else
        sqlCommand = sqlCommand +
            `update public."Todo"
        set status = '0'
        where id = ${todo_id}
        and status <> '0'
        and exists
        (
            select * 
            from public."Subtasks"
            where 
                "todo_id" = ${todo_id} 
                and status <> '1'
        );`;

    const result = await ctx.executeQuery(sqlCommand);
    if (result && result.length > 0 && result[0].rowCount && result[0].rowCount >= 1)
        return { data: { id: id }, error: '' };

    return { data: null, error: 'Oops! Something failed!', errorCode: 500 };
}