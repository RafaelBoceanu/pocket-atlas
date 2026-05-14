import { create } from 'zustand'

type Country = {
  name: string
  iso3: string
  capital?: string
  population?: number
  region?: string
  flag?: string
}

type Store = {
  selectedCountry: Country | null
  setSelectedCountry: (c: Country | null) => void
}

export const useCountryStore = create<Store>((set) => ({
  selectedCountry: null,
  setSelectedCountry: (c) => set({ selectedCountry: c }),
}))