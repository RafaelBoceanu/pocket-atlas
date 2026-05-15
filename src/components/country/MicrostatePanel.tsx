'use client'

import { useState } from 'react'
import { useCountryStore } from '@/store/countryStore'

const MICROSTATE_THRESHOLD_KM2 = 1000

export default function MicrostatePanel() {
  const [open, setOpen] = useState(false)
  const allCountries = useCountryStore((s) => s.allCountries)
  const setSelectedCountry = useCountryStore((s) => s.setSelectedCountry)

  const microstates = allCountries
    .filter((c) => c.area != null && c.area <= MICROSTATE_THRESHOLD_KM2)
    .sort((a, b) => (a.area ?? 0) - (b.area ?? 0))

  if (allCountries.length === 0) return null

  return (
    <>
      {/* Toggle button */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999999,
      }}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#0f172a',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'system-ui, sans-serif',
            transition: 'box-shadow 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          Microstates
          <span style={{
            background: '#6366f1',
            color: 'white',
            borderRadius: '999px',
            padding: '1px 7px',
            fontSize: '11px',
            fontWeight: '700',
          }}>
            {microstates.length}
          </span>
        </button>
      </div>

      {/* Drawer */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '76px',
          right: '24px',
          zIndex: 999999,
          width: '280px',
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          overflow: 'hidden',
          fontFamily: 'system-ui, sans-serif',
          maxHeight: '420px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
              Microstates
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
              Countries under 1,000 km²
            </p>
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1, scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
            {microstates.map((country) => (
              <button
                key={country.iso3}
                onClick={() => {
                  setSelectedCountry(country)
                  setOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  borderBottom: '1px solid #f8fafc',
                  background: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'system-ui, sans-serif',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
              >
                {country.flag && (
                  <img
                    src={country.flag}
                    alt={`Flag of ${country.name}`}
                    style={{
                      width: '36px',
                      height: '24px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid #e2e8f0',
                      flexShrink: 0,
                    }}
                  />
                )}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                    {country.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>
                    {country.area != null ? `${country.area.toLocaleString()} km²` : ''}
                    {country.capital ? ` · ${country.capital}` : ''}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}