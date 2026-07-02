const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const { getPool } = require('./lib/db');

async function migrateGuest() {
  const pool = getPool();
  try {
    console.log("Emptying guest_sessions table...");
    await pool.query('DELETE FROM guest_sessions');
    
    console.log("Dropping unique index...");
    try {
      await pool.query('ALTER TABLE guest_sessions DROP INDEX uq_guest_username');
    } catch (e) {
      console.log("uq_guest_username index not found or already dropped");
    }

    console.log("Dropping tag column...");
    try {
      await pool.query('ALTER TABLE guest_sessions DROP COLUMN tag');
    } catch(e) {
      console.log("Tag already dropped");
    }

    console.log("Renaming display_name to nickname...");
    try {
      await pool.query('ALTER TABLE guest_sessions CHANGE COLUMN display_name nickname varchar(50) NOT NULL');
    } catch(e) {
      console.log("display_name already renamed");
    }
    
    console.log("Adding unique constraint on nickname...");
    await pool.query('ALTER TABLE guest_sessions ADD UNIQUE INDEX uq_guest_nickname (nickname)');

    console.log("Guest Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateGuest();
