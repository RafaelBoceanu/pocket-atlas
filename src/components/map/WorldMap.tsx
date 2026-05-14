'use client'

import { useEffect, useState, useCallback } from 'react'
import { useCountryStore } from '@/store/countryStore'
import LeafletMap from './LeafletMap'

export default function WorldMap() {
  const { setSelectedCountry, selectedCountry } = useCountryStore()
  const [geoData, setGeoData] = useState<any>(null)
  const [countries, setCountries] = useState<any[]>([])

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,cca3,capital,population,region,flags')
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return
        setCountries(data.map((c: any) => ({
          name: c.name?.common,
          iso3: c.cca3,
          capital: c.capital?.[0],
          population: c.population,
          region: c.region,
          flag: c.flags?.png,
        })))
      })
  }, [])

  useEffect(() => {
    fetch('/geo/countries.geojson')
      .then((res) => res.json())
      .then(setGeoData)
  }, [])

  const onEachCountry = useCallback(
    (feature: any, layer: any) => {
      layer.on({
        mouseover: () => {
          layer.setStyle({
            fillColor: '#818cf8',
            fillOpacity: 0.6,
            weight: 1.5,
            color: '#6366f1',
          })
        },
        mouseout: () => {
          const { selectedCountry } = useCountryStore.getState()
          if (selectedCountry?.iso3 === feature.id) return
          layer.setStyle({
            fillColor: '#e2e8f0',
            fillOpacity: 0.9,
            weight: 0.8,
            color: '#cbd5e1',
          })
        },
        click: () => {
          const { selectedCountry, setSelectedCountry } = useCountryStore.getState()

          if (selectedCountry?.iso3 === feature.id) {
            setSelectedCountry(null)
            return
          }

          const country = countries.find((c) => c.iso3 === feature.id)
          if (country) setSelectedCountry(country)

          if (layer._map && layer.getBounds) {
            layer._map.fitBounds(layer.getBounds(), { padding: [20, 20] })
          }
        },
      })
    },
    [countries]
  )

  if (!geoData || countries.length === 0) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Loading map...
      </div>
    )
  }

  return (
    <LeafletMap
      geoData={geoData}
      onEachCountry={onEachCountry}
      selectedIso={selectedCountry?.iso3 ?? null}
    />
  )
}