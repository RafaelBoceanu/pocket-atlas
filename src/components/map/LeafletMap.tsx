'use client'

import dynamic from 'next/dynamic'

type Props = {
  geoData: any
  onEachCountry: (feature: any, layer: any) => void
  selectedIso: string | null
}

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
})

export default function LeafletMap(props: Props) {
  return <MapInner {...props} />
}