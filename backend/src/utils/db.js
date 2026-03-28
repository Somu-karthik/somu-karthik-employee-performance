const { Pool } = require('pg')

// Replace these with your PostgreSQL credentials
const pool = new Pool({
  user: 'postgres',           // your DB username
  host: 'localhost',          // usually localhost
  database: 'employee_tracker', // database you created in pgAdmin
  password: '123456',     // your DB password
  port: 5432,                 // default PostgreSQL port
})

module.exports = pool;