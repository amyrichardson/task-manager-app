// Set up connection to database
const pg = require('pg');
const Pool = pg.Pool;
const config = {
    database: 'task-manager',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeOutMillis: 5000
};

// Create an instance of pool object
const pool = new Pool(config);

module.exports = pool;