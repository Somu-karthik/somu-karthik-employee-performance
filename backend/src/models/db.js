const pg = require('pg')

const { Pool } = pg

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  ssl:
    process.env.DB_SSL === 'true'
      ? {
          rejectUnauthorized: false,
        }
      : false,
})

async function query(text, params = []) {
  return pool.query(text, params)
}

module.exports = { pool, query }
