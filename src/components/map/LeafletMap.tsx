'use client'

import dynamic from 'next/dynamic'
import type { GeoJsonObject } from 'geojson'
import type { Feature } from 'geojson'
import type { Country } from '@/store/countryStore'

export type LeafletMapProps = {
  geoData: GeoJsonObject | null
  countries: Country[]
  onEachCountry: (feature: Feature, layer: any) => void
  selectedIso: string | null
}

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
})

export default function LeafletMap(props: LeafletMapProps) {
  if (!props.geoData || !props.countries|| props.countries.length === 0) return null
  return <MapInner {...props} geoData={props.geoData as GeoJsonObject}/>
}