// lib/db.js — MySQL2 connection pool (singleton)
const mysql = require('mysql2/promise');

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host:              process.env.DB_HOST     || 'localhost',
      port:              parseInt(process.env.DB_PORT || '3306'),
      user:              process.env.DB_USER     || 'root',
      password:          process.env.DB_PASSWORD || 'admin',
      database:          process.env.DB_NAME     || 'leastscore',
      waitForConnections: true,
      connectionLimit:   10,
      queueLimit:        0,
      timezone:          'Z',
    });
  }
  return pool;
}

module.exports = { getPool };
