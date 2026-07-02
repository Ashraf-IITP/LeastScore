const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const { getPool } = require('./lib/db');

async function migrate() {
  const pool = getPool();
  try {
    console.log('Adding must_reset_password column if missing...');
    try {
      await pool.query(
        'ALTER TABLE users ADD COLUMN must_reset_password tinyint(1) NOT NULL DEFAULT 0'
      );
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') throw e;
      console.log('must_reset_password already exists');
    }

    console.log('Ensuring email is unique...');
    try {
      await pool.query('ALTER TABLE users DROP INDEX idx_email');
    } catch (e) {
      console.log('idx_email not found or already dropped');
    }
    try {
      await pool.query('ALTER TABLE users ADD UNIQUE KEY uq_email (email)');
    } catch (e) {
      if (e.code !== 'ER_DUP_KEYNAME') throw e;
      console.log('uq_email already exists');
    }

    console.log('Email uniqueness migration completed.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
