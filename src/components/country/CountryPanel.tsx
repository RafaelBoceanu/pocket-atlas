'use client'

import { useCountryStore } from '@/store/countryStore'

export default function CountryPanel() {
  const country = useCountryStore((s) => s.selectedCountry)
  const setSelectedCountry = useCountryStore((s) => s.setSelectedCountry)

  if (!country) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      zIndex: 999999,
      width: '300px',
      background: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {country.flag && (
        <div style={{ position: 'relative' }}>
          <img
            src={country.flag}
            alt={country.name}
            style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
          />
          <button
            onClick={() => setSelectedCountry(null)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#374151',
              backdropFilter: 'blur(4px)',
            }}
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>
      )}

      <div style={{ padding: '16px' }}>
        <h2 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px' }}>
          {country.name}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { label: 'Capital', value: country.capital ?? 'N/A' },
            { label: 'Region', value: country.region ?? 'N/A' },
            { label: 'Population', value: country.population?.toLocaleString() ?? 'N/A' },
            { label: 'ISO', value: country.iso3 },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: '#f8fafc',
              borderRadius: '10px',
              padding: '10px 12px',
              border: '1px solid #e2e8f0',
            }}>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                {label}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}