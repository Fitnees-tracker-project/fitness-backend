// This is where we will be building pg.Client instance
require('dotenv').config()

const pg = require('pg');

const client = new pg.Client(process.env.DB_URL || 'postgres://localhost:5432/fitness-dev')


module.exports = {
    client
}
