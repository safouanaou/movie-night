const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'movie_night_dev',
    user: 'safouanaouezghar'
});

module.exports = pool;