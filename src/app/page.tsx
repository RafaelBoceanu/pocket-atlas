import WorldMap from '@/components/map/WorldMap'
import CountryPanel from '@/components/country/CountryPanel'
import SearchBar from '@/components/search/SearchBar'

export default function HomePage() {
  return (
    <>
      <main className='relative h-screen w-screen overflow-hidden'>
        <SearchBar />
        <WorldMap />
      </main>
      <CountryPanel />
    </>
  )
}