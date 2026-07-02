const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const { allCountries } = require('country-telephone-data');
const { getPool } = require('./lib/db');
const { cleanCountryName } = require('./lib/countries');

async function migrateCountries() {
  const pool = getPool();

  try {
    console.log('Ensuring countries table has iso2 and phone_code columns...');
    const [columns] = await pool.query('SHOW COLUMNS FROM countries');
    const columnNames = new Set(columns.map((c) => c.Field));

    if (!columnNames.has('iso2')) {
      await pool.query(
        "ALTER TABLE countries ADD COLUMN iso2 char(2) NOT NULL DEFAULT '' AFTER country_name"
      );
    }
    if (!columnNames.has('phone_code')) {
      await pool.query(
        "ALTER TABLE countries ADD COLUMN phone_code varchar(5) NOT NULL DEFAULT '' AFTER iso2"
      );
    }

    console.log('Clearing existing countries...');
    await pool.query('DELETE FROM countries');

    console.log(`Inserting ${allCountries.length} countries...`);
    const values = allCountries.map((c) => [
      cleanCountryName(c.name),
      c.iso2.toLowerCase(),
      c.dialCode,
    ]);

    await pool.query(
      'INSERT INTO countries (country_name, iso2, phone_code) VALUES ?',
      [values]
    );

    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM countries');
    console.log(`Migration completed. ${rows[0].count} countries in database.`);
    process.exit(0);
  } catch (error) {
    console.error('Country migration failed:', error);
    process.exit(1);
  }
}

migrateCountries();
