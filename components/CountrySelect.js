import { useEffect, useMemo, useRef, useState } from 'react';

const selectStyle = {
  width: '100%',
  background: 'rgba(0,0,0,0.35)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#F0F4FF',
  padding: '13px 15px',
  borderRadius: '13px',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function CountrySelect({ value, onChange, disabled = false }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/countries')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.countries) setCountries(d.countries);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const selected = useMemo(
    () => countries.find((c) => String(c.id) === String(value)),
    [countries, value]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) =>
      c.name.toLowerCase().includes(q)
      || c.phoneCode.includes(q)
      || c.iso2.toLowerCase().includes(q)
    );
  }, [countries, query]);

  const pick = (country) => {
    onChange(String(country.id));
    setOpen(false);
    setQuery('');
  };

  return (
    <div className="input-group country-select" ref={containerRef}>
      <label>Country</label>
      <div className="country-select-control">
        <button
          type="button"
          className="country-select-trigger"
          onClick={() => !disabled && !loading && setOpen((o) => !o)}
          disabled={disabled || loading}
          style={selectStyle}
        >
          {loading ? (
            <span className="country-select-placeholder">Loading countries…</span>
          ) : selected ? (
            <span className="country-select-value">
              <span className="country-flag">{selected.flag}</span>
              <span>{selected.name}</span>
              <span className="country-dial">+{selected.phoneCode}</span>
            </span>
          ) : (
            <span className="country-select-placeholder">Select your country</span>
          )}
          <span className="country-select-chevron">{open ? '▴' : '▾'}</span>
        </button>

        {open && (
          <div className="country-select-menu">
            <input
              type="text"
              className="country-select-search"
              placeholder="Search country or code…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <ul className="country-select-list">
              {filtered.length === 0 ? (
                <li className="country-select-empty">No countries found</li>
              ) : (
                filtered.map((country) => (
                  <li key={country.id}>
                    <button
                      type="button"
                      className={`country-select-option${String(country.id) === String(value) ? ' selected' : ''}`}
                      onClick={() => pick(country)}
                    >
                      <span className="country-flag">{country.flag}</span>
                      <span className="country-name">{country.name}</span>
                      <span className="country-dial">+{country.phoneCode}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        .country-select-control {
          position: relative;
        }
        .country-select-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          cursor: pointer;
          text-align: left;
          font-family: 'DM Sans', sans-serif;
        }
        .country-select-trigger:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .country-select-value {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          flex: 1;
        }
        .country-select-placeholder {
          color: #3D4A5A;
        }
        .country-flag {
          font-size: 18px;
          line-height: 1;
          flex-shrink: 0;
        }
        .country-dial {
          margin-left: auto;
          color: #8896A7;
          font-size: 13px;
          flex-shrink: 0;
        }
        .country-select-chevron {
          color: #8896A7;
          font-size: 11px;
          flex-shrink: 0;
        }
        .country-select-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          z-index: 30;
          background: rgba(12, 16, 28, 0.98);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 13px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.45);
          overflow: hidden;
        }
        .country-select-search {
          width: 100%;
          box-sizing: border-box;
          background: rgba(0,0,0,0.35);
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          color: #F0F4FF;
          padding: 12px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
        }
        .country-select-search::placeholder {
          color: #3D4A5A;
        }
        .country-select-list {
          list-style: none;
          margin: 0;
          padding: 6px;
          max-height: 220px;
          overflow-y: auto;
        }
        .country-select-option {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: #F0F4FF;
          padding: 10px 10px;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
        }
        .country-select-option:hover,
        .country-select-option.selected {
          background: rgba(255,200,87,0.12);
        }
        .country-name {
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .country-select-empty {
          padding: 12px 10px;
          color: #8896A7;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
