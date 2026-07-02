/** Helpers for country display (flags, name cleanup). */

const POPULAR_ISO2 = ['us', 'in', 'gb', 'ca', 'au'];

function cleanCountryName(name) {
  return name.replace(/\s*\([^)]*\)\s*/g, '').trim();
}

function iso2ToFlag(iso2) {
  if (!iso2 || iso2.length !== 2) return '';
  return [...iso2.toUpperCase()].map((c) =>
    String.fromCodePoint(c.charCodeAt(0) + 127397)
  ).join('');
}

function sortCountries(countries) {
  const popular = [];
  const rest = [];

  for (const country of countries) {
    const idx = POPULAR_ISO2.indexOf(country.iso2);
    if (idx >= 0) {
      popular[idx] = country;
    } else {
      rest.push(country);
    }
  }

  rest.sort((a, b) => a.name.localeCompare(b.name));
  return [...popular.filter(Boolean), ...rest];
}

function formatCountryRow(row) {
  return {
    id: row.id,
    name: row.country_name,
    iso2: row.iso2,
    phoneCode: row.phone_code,
    flag: iso2ToFlag(row.iso2),
  };
}

module.exports = {
  POPULAR_ISO2,
  cleanCountryName,
  iso2ToFlag,
  sortCountries,
  formatCountryRow,
};
