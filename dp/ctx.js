const config = require('config');
const { Pool } = require("pg");

/**
 * Read config file and initial connection to the database
 */
const pool = new Pool({
    user: config.get('cns.user'),
    host: config.get('cns.host'),
    database: config.get('cns.database'),
    password: process.env.PostgreSQLPass || "",
    port: config.get('cns.port')
});

var client = null;

/**
 * Manipulating data at database by passing T-SQL syntax
 * @param {*} sqlCommand 
 * @returns 
 */
module.exports.executeQuery = async function(sqlCommand) {
    if (!sqlCommand || sqlCommand === '')
        return null;

    //this line could be improved using connection pool
    if (!client) client = await pool.connect();

    const result = await client.query(sqlCommand);
    return result;
}