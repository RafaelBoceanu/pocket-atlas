import { create } from 'zustand'

type Country = {
  name: string
  nativeName?: string | null
  iso3: string
  capital?: string | null
  region?: string | null
  subregion?: string | null
  population?: number | null
  area?: number | null
  flag?: string
  languages?: string | null
  currencies?: string | null
  timezones?: string | null
  borders?: string[] | null
}

type Store = {
  selectedCountry: Country | null
  setSelectedCountry: (c: Country | null) => void
}

export const useCountryStore = create<Store>((set) => ({
  selectedCountry: null,
  setSelectedCountry: (c) => set({ selectedCountry: c }),
}))