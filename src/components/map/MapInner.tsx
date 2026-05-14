'use client'

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

type Props = {
  geoData: any
  onEachCountry: (feature: any, layer: any) => void
}

export default function MapInner({ geoData, onEachCountry }: Props) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="h-screen w-screen"
      zoomControl={false}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
      />

      <GeoJSON
        data={geoData}
        onEachFeature={onEachCountry}
        style={() => ({
          color: '#cbd5e1',
          weight: 0.8,
          fillColor: '#e2e8f0',
          fillOpacity: 0.9,
        })}
      />
    </MapContainer>
  )
}