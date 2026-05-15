'use client'

import { useCountryStore } from '@/store/countryStore'

console.log("PANEL STORE INSTANCE:", useCountryStore === useCountryStore)

const row = (label: string, value: string | null | undefined) => {
  if (!value) return null
  return (
    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
      <span style={{
        fontSize: '11px',
        fontWeight: '600',
        color: '#94a3b8',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap' as const,
        paddingTop: '1px',
        flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500', textAlign: 'right' as const }}>
        {value}
      </span>
    </div>
  )
}

export default function CountryPanel() {
  const country = useCountryStore((s) => s.selectedCountry)
  const allCountries = useCountryStore((s) => s.allCountries)
  const setSelectedCountry = useCountryStore((s) => s.setSelectedCountry)

  if (!country) return null

  const borderCountries = (country.borders ?? [])
    .map((iso) => allCountries.find((c) => c.iso3 === iso))
    .filter(Boolean) as typeof allCountries

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
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Flag */}
      {country.flag && (
        <div style={{ flexShrink: 0 }}>
          <img
            src={country.flag}
            alt={`Flag of ${country.name}`}
            style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* Scrollable body */}
      <div style={{ overflowY: 'auto', flex: 1, scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>

        {/* Header */}
        <div style={{ padding: '16px 16px 0' }}>
          <h2 style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: '700',
            color: '#0f172a',
            letterSpacing: '-0.4px',
            lineHeight: 1.2,
          }}>
            {country.name}
          </h2>
          {country.nativeName && country.nativeName !== country.name && (
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
              {country.nativeName}
            </p>
          )}
        </div>

        {/* Divider */}
        <div style={{ margin: '14px 16px 0', height: '1px', background: '#f1f5f9' }} />

        {/* Stats */}
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {row('Capital', country.capital)}
          {row('Subregion', country.subregion ?? country.region)}
          {row('Population', country.population?.toLocaleString() ?? null)}
          {row('Area', country.area != null ? `${country.area.toLocaleString()} km²` : null)}
          {row('Languages', country.languages)}
          {row('Currency', country.currencies)}
          {row('Timezone', country.timezones)}
          {row('ISO Code', country.iso3)}
        </div>

        {/* Borders */}
        {borderCountries.length > 0 && (
          <>
            <div style={{ margin: '0 16px', height: '1px', background: '#f1f5f9' }} />
            <div style={{ padding: '12px 16px 16px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'block',
                marginBottom: '10px',
              }}>
                Borders
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {borderCountries.map((b) => (
                  <button
                    key={b.iso3}
                    onClick={() => setSelectedCountry(b)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '5px 8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#475569',
                      fontFamily: 'system-ui, sans-serif',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  >
                    {b.flag && (
                      <img
                        src={b.flag}
                        alt={b.name}
                        style={{ width: '20px', height: '13px', objectFit: 'cover', borderRadius: '2px', border: '1px solid #e2e8f0' }}
                      />
                    )}
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Scroll fade indicator */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '32px',
        background: 'linear-gradient(to top, white, transparent)',
        pointerEvents: 'none',
        borderRadius: '0 0 16px 16px',
      }} />
    </div>
  )
}