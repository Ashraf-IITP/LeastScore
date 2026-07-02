import { getPool } from '../../../lib/db';
import { formatCountryRow, sortCountries } from '../../../lib/countries';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT id, country_name, iso2, phone_code FROM countries ORDER BY country_name ASC'
    );

    const countries = sortCountries(rows.map(formatCountryRow));
    return res.status(200).json({ countries });
  } catch (err) {
    console.error('[/api/countries]', err);
    return res.status(500).json({ error: 'Failed to load countries.' });
  }
}
