const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const { getPool } = require('./lib/db');

async function migrate() {
  const pool = getPool();
  try {
    console.log("Emptying users table...");
    await pool.query('DELETE FROM users');
    
    console.log("Dropping constraints/indexes related to tag and display_name...");
    try {
      await pool.query('ALTER TABLE users DROP INDEX uq_username');
    } catch (e) {
      console.log("uq_username index not found or already dropped");
    }

    console.log("Renaming display_name to first_name...");
    await pool.query('ALTER TABLE users CHANGE COLUMN display_name first_name varchar(20) NOT NULL');
    
    console.log("Dropping tag column...");
    await pool.query('ALTER TABLE users DROP COLUMN tag');
    
    console.log("Adding new columns...");
    await pool.query('ALTER TABLE users ADD COLUMN last_name varchar(20) DEFAULT NULL');
    await pool.query('ALTER TABLE users ADD COLUMN nickname varchar(20) DEFAULT NULL');
    await pool.query('ALTER TABLE users ADD COLUMN country_id int unsigned DEFAULT NULL');
    await pool.query('ALTER TABLE users ADD COLUMN dob date DEFAULT NULL');
    await pool.query('ALTER TABLE users ADD COLUMN gender enum(\'male\', \'female\', \'other\') DEFAULT NULL');
    
    console.log("Creating countries table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS countries (
        id int unsigned NOT NULL AUTO_INCREMENT,
        country_name varchar(255) NOT NULL,
        iso2 char(2) NOT NULL,
        phone_code varchar(5) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY uq_countries_iso2 (iso2)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
