const config = require('config');

/**
 * Check required values in the config file
 */
module.exports = function() {
    const env = process.env.NODE_ENV || 'default';
    if (!config.has("port") || isNaN(config.get("port"))){
        console.error(`Fatal error! Please set the port number in the config\\${env}.json file.`);
        process.exit(1);
    }

    const dbPass = process.env.PostgreSQLPass;
    if (!dbPass)
        console.warn("Warning! You not set the PostgreSQLPass environment variable. We going to use empty string for it.")

    //check database connection settings
    if (!config.has("cns")){    
        console.error(`Fatal error! Please set the database connection in the config\\${env}.json file as 'cns' tag.`);
        process.exit(1);
    }

    const cns = config.get("cns");
    if (!cns.user || !cns.host || !cns.database || !cns.port){    
        console.error(`Fatal error! Please set the proper value for database connection in the config\\${env}.json file, under 'cns' tag.`);
        process.exit(1);
    }
}