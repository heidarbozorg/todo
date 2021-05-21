/**
 * Extract error code and error message from the database result
 * @param {*} dbResult 
 * @returns 
 */
module.exports.getError = function(dbResult) {
    let error = 'Oops! Something wrong!';
    let status = 500;

    if (dbResult && dbResult.error)
        error = dbResult.error;

    if (dbResult && dbResult.errorCode)
        status = dbResult.errorCode;

    return { status: status, body: error };
}