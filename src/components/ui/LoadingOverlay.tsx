'use client'

import { useCountryStore } from "@/store/countryStore"
import { use } from "react"

export default function LoadingOverlay() {
    const isLoading = useCountryStore((s) => s.isLoading)
    const error = useCountryStore((s) => s.error)

    if (!isLoading && !error) return null

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
            gap: '12px',
        }}>
            {error ? (
                <>
                    <div style={{ fontSize: '32px' }}>⚠️</div>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                        Failed to load map data
                    </p>
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                        {error}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '8px',
                            background: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px 20px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontFamily: 'system-ui, sans-serif',
                        }}
                    >
                        Retry
                    </button>
                </>
            ) : (
                <>
                    <div style={{ 
                        width: '36px',
                        height: '36px',
                        border: '3px solid #e2e8f0',
                        borderTop: '3px solid #6366f1',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite', 
                    }} />
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0, fontWeight: '500' }}>
                        Loading atlas...
                    </p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </>
            )}
        </div>
    )
}