'use client'

import { useEffect, useState, useCallback } from 'react'
import { useCountryStore } from '@/store/countryStore'
import LeafletMap from './LeafletMap'

export default function WorldMap() {
    const { setSelectedCountry } = useCountryStore()

    const [geoData, setGeoData] = useState<any>(null)
    const [countries, setCountries] = useState<any[]>([])
    const [selectedBounds, setSelectedBounds] = useState<any>(null)

    // Load countries
    useEffect(() => {
        fetch(
            'https://restcountries.com/v3.1/all?fields=name,cca3,capital,population,region,flags'
        )
            .then((res) => res.json())
            .then((data) => {
                if (!Array.isArray(data)) return

                const formatted = data.map((c: any) => ({
                    name: c.name?.common,
                    iso3: c.cca3,
                    capital: c.capital?.[0],
                    population: c.population,
                    region: c.region,
                    flag: c.flags?.png,
                }))

                setCountries(formatted)
            })
    }, [])

    // Load GeoJSON
    useEffect(() => {
        fetch('/geo/countries.geojson')
            .then((res) => res.json())
            .then((data) => setGeoData(data))
    }, [])

    // CLEAN click handler (no stale state issues)
    const onEachCountry = useCallback(
        (feature: any, layer: any) => {
            layer.on({
                mouseover: (e: any) => {
                    e.target.setStyle({
                        fillColor: '#818cf8',
                        fillOpacity: 0.6,
                        weight: 1.5,
                        color: '#6366f1'
                    })
                },

                mouseout: (e: any) => {
                    e.target.setStyle({
                        fillColor: '#e2e8f0',
                        fillOpacity: 0.9,
                        weight: 0.8,
                        color: '#cbd5e1'
                    })
                },

                click: (e: any) => {
                    const layer = e.target
                    const iso3 = feature.id

                    console.log("ISO3:", iso3)

                    const country = countries.find(
                        (c) => c.iso3 === iso3
                    )

                    if (!country) {
                        console.warn("No country match:", iso3)
                        return
                    }

                    console.log("COUNTRY FOUND:", country)

                    setSelectedCountry(country)

                    // SAFE zoom (no internal leaflet hack)
                    const map = layer._map
                    if (map && layer.getBounds) {
                        map.fitBounds(layer.getBounds(), {
                            padding: [20, 20],
                        })
                    }
                }
            })
        },
        [countries, setSelectedCountry]
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
        />
    )
}