'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
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
        (Object.values(c.name?.nativeName ?? {}) as { common: string }[])[0]?.common ?? null,
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

  const {
    setSelectedCountry,
    selectedCountry,
    setAllCountries,
    setIsLoading,
    setError,
  } = useCountryStore()

  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null)
  const [countries, setCountries] = useState<Country[]>([])

  // refs
  const selectedLayerRef =
    useRef<
      (Layer & {
        setStyle: (s: PathOptions) => void
        _map?: any
        getBounds?: () => any
      }) | null
    >(null)

  const layerRefMap = useRef<Record<string, any>>({})
  const countriesRef = useRef<Country[]>([])

  // ----------------------------
  // Fetch countries
  // ----------------------------
  useEffect(() => {
    setIsLoading(true)

    Promise.all([
      fetch(
        'https://restcountries.com/v3.1/all?fields=name,cca3,capital,population,region,subregion,flags,borders,timezones,area'
      ).then((r) => r.json()),
      fetch(
        'https://restcountries.com/v3.1/all?fields=cca3,languages,currencies'
      ).then((r) => r.json()),
    ])
      .then(([primary, secondary]) => {
        const formatted = formatCountries(primary, secondary)

        setCountries(formatted)
        countriesRef.current = formatted
        setAllCountries(formatted)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [])

  // ----------------------------
  // Load GeoJSON
  // ----------------------------
  useEffect(() => {
    fetch('/geo/countries.geojson')
      .then((r) => r.json())
      .then((data) => setGeoData(data))
      .catch((err) => setError(err.message))
  }, [])

  // ----------------------------
  // Restore from URL
  // ----------------------------
  useEffect(() => {
    const iso = searchParams.get('country')
    if (!iso || countries.length === 0) return

    const match = countries.find((c) => c.iso3 === iso)
    if (match) setSelectedCountry(match)
  }, [countries, searchParams, setSelectedCountry])

  // ----------------------------
  // URL sync
  // ----------------------------
  useEffect(() => {
    if (!selectedCountry) return
    router.replace(`?country=${selectedCountry.iso3}`, { scroll: false })
  }, [selectedCountry, router])

  // ----------------------------
  // External sync (IMPORTANT)
  // highlight + zoom from panel clicks
  // ----------------------------
  useEffect(() => {
    if (!selectedCountry) return

    const layer = layerRefMap.current[selectedCountry.iso3]
    if (!layer) return

    // reset previous highlight
    if (
      selectedLayerRef.current &&
      selectedLayerRef.current !== layer
    ) {
      selectedLayerRef.current.setStyle(STYLE_DEFAULT)
    }

    // highlight new
    layer.setStyle(STYLE_SELECTED)
    selectedLayerRef.current = layer

    // zoom
    if (layer._map && layer.getBounds) {
      layer._map.fitBounds(layer.getBounds(), {
        padding: [20, 20],
        animate: true,
      })
    }
  }, [selectedCountry])

  // ----------------------------
  // Leaflet interaction
  // ----------------------------
  const onEachCountry = useCallback(
    (feature: Feature, layer: any) => {
      const iso3 = feature.id as string

      layerRefMap.current[iso3] = layer

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

          // toggle off
          if (previous === layer) {
            layer.setStyle(STYLE_DEFAULT)
            selectedLayerRef.current = null
            setSelectedCountry(null)
            return
          }

          // reset previous
          if (previous) {
            previous.setStyle(STYLE_DEFAULT)
          }

          // select new
          layer.setStyle(STYLE_SELECTED)
          selectedLayerRef.current = layer

          const country = countriesRef.current.find(
            (c) => c.iso3 === iso3
          )

            if (country) {
                queueMicrotask(() => { setSelectedCountry(country) })
            }

          // zoom
          if (layer._map && layer.getBounds) {
            layer._map.fitBounds(layer.getBounds(), {
              padding: [20, 20],
            })
          }
        },
      })
    },
    [setSelectedCountry]
  )

  // clear external selection styling
  useEffect(() => {
    if (!selectedCountry && selectedLayerRef.current) {
      selectedLayerRef.current.setStyle(STYLE_DEFAULT)
      selectedLayerRef.current = null
    }
  }, [selectedCountry])

  return (
    <LeafletMap
      geoData={geoData}
      countries={countries}
      onEachCountry={onEachCountry}
      selectedIso={selectedCountry?.iso3 ?? null}
    />
  )
}