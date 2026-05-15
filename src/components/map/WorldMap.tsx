'use client'

import { useEffect, useState, useCallback, useRef, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCountryStore, type Country } from '@/store/countryStore'
import LeafletMap from './LeafletMap'
import type { Layer, LeafletMouseEvent, PathOptions } from 'leaflet'
import type { Feature, GeoJsonObject } from 'geojson'

const STYLE_DEFAULT: PathOptions = {
    color: '#cbd5e1',
    weight: 0.8,
    fillColor: '#e2e8f0',
    fillOpacity: 0.9,
}

const STYLE_HOVER: PathOptions = {
    color: '#6366f1',
    weight: 1.5,
    fillColor: '#818cf8',
    fillOpacity: 0.6,
}

const STYLE_SELECTED: PathOptions = {
    color: '#4338ca',
    weight: 2,
    fillColor: '#6366f1',
    fillOpacity: 0.75,
}

function formatCountries(primary: any[], secondary: any[]): Country[] {
    const secondaryMap = new Map(secondary.map((c: any) => [c.cca3, c]))
    return primary.map((c: any) => {
        const extra = secondaryMap.get(c.cca3) ?? {}
        return {
            name: c.name?.common ?? '',
            nativeName:
                (Object.values(c.name?.nativeName ?? {}) as { common: string }[])[0]
                 ?.common ?? null,
            iso3: c.cca3,
            capital: c.capital?.[0] ?? null,
            region: c.region ?? null,
            subregion: c.subregion ?? null,
            population: c.population ?? null,
            area: c.area ?? null,
            flag: c.flags?.png ?? null,
            timezones: c.timezones?.[0] ?? null,
            borders: c.borders ?? [],
            languages: extra.languages
                ? Object.values(extra.languages).join(', ')
                : null,
            currencies: extra.currencies
                ? Object.values(extra.currencies)
                    .map((cur: any) => `${cur.name} (${cur.symbol})`)
                    .join(', ')
                : null,
        }
    })
}

export default function WorldMap() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const { setSelectedCountry, selectedCountry, setAllCountries, setIsLoading, setError } = useCountryStore()

    const [geoData, setGeoData] = useState<GeoJsonObject | null>(null)
    const [countries, setCountries] = useState<Country[]>([])
    const selectedLayerRef = useRef<Layer & { setStyle: (s: PathOptions) => void; _map?: any; getBound?: () => any } | null>(null)

    // Fetch country data
    useEffect(() => {
        setIsLoading(true)
        Promise.all([
            fetch('https://restcountries.com/v3.1/all?fields=name,cca3,capital,population,region,subregion,flags,borders,timezones,area')
                .then((r) => {
                    if (!r.ok) throw new Error('Failed to fetch primary country data')
                    return r.json()
                }),
            fetch('https://restcountries.com/v3.1/all?fields=cca3,languages,currencies')
                .then((r) => {
                    if (!r.ok) throw new Error('Failed to fetch secondary country data')
                    return r.json()
                }),
        ]).then(([primary, secondary]) => {
            if (!Array.isArray(primary) || !Array.isArray(secondary)) {
                throw new Error('Unexpected API response format')
            }

            const formatted = formatCountries(primary, secondary)
            setCountries(formatted)
            setAllCountries(formatted)
            setIsLoading(false)
        })
    }, [setAllCountries, setIsLoading, setError])

    // Fetch GeoJSON data
    useEffect(() => {
        fetch('/geo/countries.geojson')
            .then((r) => {
                if (!r.ok) throw new Error('Failed to load map data')
                return r.json()
            })
            .then((data) => setGeoData(data))
            .catch((err: Error) => setError(err.message))
    }, [setError])

    // Restore selection from URL on load
    useEffect(() => {
        const iso = searchParams.get('country')
        if (iso && countries.length > 0) {
            const match = countries.find((c) => c.iso3 === iso)
            if (match) setSelectedCountry(match)
        }
    }, [countries, searchParams, setSelectedCountry])

    // Sync URL when selection changes
    useEffect(() => {
        if (selectedCountry) {
            router.replace(`?country=${selectedCountry.iso3}`, { scroll: false })
        } else {
            router.replace('/', { scroll: false })
        }
    }, [selectedCountry, router])

    const onEachCountry = useCallback(
        (feature: Feature, layer: any) => {
            layer.on({
                mouseover: () => {
                    if (selectedLayerRef.current === layer) return
                    layer.setStyle(STYLE_HOVER)
                },
                mouseout: () => {
                    if (selectedLayerRef.current === layer) return
                    layer.setStyle(STYLE_DEFAULT)
                },
                click: (e: LeafletMouseEvent) => {
                    if (e.originalEvent) {
                        e.originalEvent.stopPropagation()
                    }
                    
                    const previous = selectedLayerRef.current

                    // Deselect if clicking the same country
                    if (previous === layer) {
                        layer.setStyle(STYLE_DEFAULT)
                        selectedLayerRef.current = null
                        setSelectedCountry(null)
                        return
                    }

                    // Reset previous
                    if (previous) {
                        previous.setStyle(STYLE_DEFAULT)
                    }

                    // Select new
                    layer.setStyle(STYLE_SELECTED)
                    selectedLayerRef.current = layer

                    const iso3 = feature.id as string
                    const country = countries.find((c) => c.iso3 === iso3)
                    if (country) setSelectedCountry(country)

                    if (layer._map && layer.getBounds) {
                        layer._map.fitBounds(layer.getBounds(), { padding: [20, 20] })
                    }
                },
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
            selectedIso={selectedCountry?.iso3 ?? null}
        />
    )
}