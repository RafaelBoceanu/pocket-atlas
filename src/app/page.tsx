import WorldMap from '@/components/map/WorldMap'
import CountryPanel from '@/components/country/CountryPanel'

export default function HomePage() {
  return (
    <>
      <main className='relative h-screen w-screen overflow-hidden'>
        <WorldMap />
      </main>
      <CountryPanel />
    </>
  )
}