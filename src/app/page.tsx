import { Suspense } from 'react'
import WorldMap from '@/components/map/WorldMap'
import CountryPanel from '@/components/country/CountryPanel'
import MicrostatePanel from '@/components/country/MicrostatePanel'
import LoadingOverlay from '@/components/ui/LoadingOverlay'

export default function HomePage() {
  return (
    <>
      <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Suspense>
          <WorldMap />
        </Suspense>
      </main>
      <LoadingOverlay />
      <CountryPanel />
      <MicrostatePanel />
    </>
  )
}