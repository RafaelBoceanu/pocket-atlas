'use client'

import { useEffect, useState, useCallback } from 'react'
import { useCountryStore } from '@/store/countryStore'
import LeafletMap from './LeafletMap'

export default function WorldMap() {
    const { setSelectedCountry, selectedCountry, setAllCountries } = useCountryStore()
    const [geoData, setGeoData] = useState<any>(null)
    const [countries, setCountries] = useState<any[]>([])

    useEffect(() => {
        Promise.all([
            fetch('https://restcountries.com/v3.1/all?fields=name,cca3,capital,population,region,subregion,flags,borders,timezones,area')
                .then(r => r.json()),
            fetch('https://restcountries.com/v3.1/all?fields=cca3,languages,currencies')
                .then(r => r.json()),
        ]).then(([primary, secondary]) => {
            if (!Array.isArray(primary) || !Array.isArray(secondary)) return

            const secondaryMap = new Map(secondary.map((c: any) => [c.cca3, c]))

            const formatted = primary.map((c: any) => {
                const extra = secondaryMap.get(c.cca3) ?? {}
                return {
                    name: c.name?.common,
                    nativeName: (Object.values(c.name?.nativeName ?? {}) as { common: string }[])[0]?.common ?? null,
                    iso3: c.cca3,
                    capital: c.capital?.[0] ?? null,
                    region: c.region ?? null,
                    subregion: c.subregion ?? null,
                    population: c.population ?? null,
                    area: c.area ?? null,
                    flag: c.flags?.png,
                    timezones: c.timezones?.[0] ?? null,
                    borders: c.borders ?? [],
                    languages: extra.languages ? Object.values(extra.languages).join(', ') : null,
                    currencies: extra.currencies
                        ? Object.values(extra.currencies).map((cur: any) => `${cur.name} (${cur.symbol})`).join(', ')
                        : null,
                }
            })

            setCountries(formatted)
            setAllCountries(formatted)
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