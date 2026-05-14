'use client'

import { useCountryStore } from '@/store/countryStore'

export default function CountryPanel() {
  const country = useCountryStore((s) => s.selectedCountry)

  if (!country) return null

  const stats = [
    { label: 'Capital', value: country.capital ?? 'N/A' },
    { label: 'Region', value: country.subregion ?? country.region ?? 'N/A' },
    { label: 'Population', value: country.population ? country.population.toLocaleString() : 'N/A' },
    { label: 'Area', value: country.area ? `${country.area.toLocaleString()} km²` : 'N/A' },
    { label: 'Languages', value: country.languages ?? 'N/A' },
    { label: 'Currency', value: country.currencies ?? 'N/A' },
    { label: 'Timezone', value: country.timezones ?? 'N/A' },
    { label: 'ISO Code', value: country.iso3 },
  ]

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      zIndex: 999999,
      width: '310px',
      background: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif',
      maxHeight: 'calc(100vh - 48px)',
      overflowY: 'auto',
    }}>

      {/* Flag */}
      {country.flag && (
        <img
          src={country.flag}
          alt={country.name}
          style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
        />
      )}

      {/* Header */}
      <div style={{ padding: '16px 16px 0' }}>
        <h2 style={{ margin: '0', fontSize: '22px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.4px', lineHeight: 1.2 }}>
          {country.name}
        </h2>
        {country.nativeName && country.nativeName !== country.name && (
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
            {country.nativeName}
          </p>
        )}
      </div>

      {/* Divider */}
      <div style={{ margin: '14px 16px', height: '1px', background: '#f1f5f9' }} />

      {/* Stats grid */}
      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {stats.map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', paddingTop: '1px' }}>
              {label}
            </span>
            <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500', textAlign: 'right' }}>
              {value}
            </span>
          </div>
        ))}

        {/* Borders */}
        {country.borders && country.borders.length > 0 && (
          <>
            <div style={{ height: '1px', background: '#f1f5f9', margin: '2px 0' }} />
            <div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                Borders
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {country.borders.map((b) => (
                  <span key={b} style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    background: '#f1f5f9',
                    color: '#475569',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    border: '1px solid #e2e8f0',
                    letterSpacing: '0.3px',
                  }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}