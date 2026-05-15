'use client'

import { useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import type { GeoJsonObject, Feature } from 'geojson'
import type { PathOptions } from 'leaflet'
import { useCountryStore } from '@/store/countryStore'

const WORLD_BOUNDS = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180))

const STYLE_DEFAULT: PathOptions = {
  color: '#cbd5e1',
  weight: 0.8,
  fillColor: '#e2e8f0',
  fillOpacity: 0.9,
}

const STYLE_SELECTED: PathOptions = {
  color: '#4338ca',
  weight: 2,
  fillColor: '#6366f1',
  fillOpacity: 0.75,
}

function MapClickHandler() {
  const setSelectedCountry = useCountryStore((s) => s.setSelectedCountry)
  useMapEvents({
    click: () => {
      setSelectedCountry(null)
    },
  })
  return null
}

type Props = {
  geoData: GeoJsonObject
  onEachCountry: (feature: Feature, layer: any) => void
  selectedIso: string | null
}

export default function MapInner({ geoData, onEachCountry, selectedIso }: Props) {
  const geoJsonRef = useRef<any>(null)

  // Style function — called on initial render only (no remount)
  const styleFeature = (feature?: Feature): PathOptions => {
    if (feature?.id === selectedIso) return STYLE_SELECTED
    return STYLE_DEFAULT
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={8}
      maxBounds={WORLD_BOUNDS}
      maxBoundsViscosity={1.0}
      style={{ height: '100vh', width: '100vh', position: 'absolute', top: 0, left: 0}}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        noWrap={true}
        bounds={WORLD_BOUNDS}
      />
      <MapClickHandler />
      <GeoJSON
        ref={geoJsonRef}
        data={geoData}
        onEachFeature={onEachCountry}
        style={styleFeature}
      />
    </MapContainer>
  )
}