const { getPool } = require('../lib/db');

async function run() {
  const pool = getPool();
  try {
    await pool.query('ALTER TABLE otp_sessions CHANGE phone email VARCHAR(255) NOT NULL');
    console.log('Success');
  } catch (e) {
    if (e.code === 'ER_BAD_FIELD_ERROR' || e.code === 'ER_DUP_FIELDNAME') {
      console.log('Already altered or error: ', e.message);
    } else {
      console.error(e);
    }
  }
  process.exit(0);
}

run();
