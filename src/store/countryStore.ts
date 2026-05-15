import { create } from 'zustand'

export type Country = {
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
  allCountries: Country[]
  setAllCountries: (c: Country[]) => void
  isLoading: boolean
  setIsLoading: (v: boolean) => void
  error: string | null
  setError: (v: string | null) => void
}

export const useCountryStore = create<Store>((set) => ({
  selectedCountry: null,
  setSelectedCountry: (c) => set({ selectedCountry: c }),
  allCountries: [],
  setAllCountries: (c) => set({ allCountries: c }),
  isLoading: true,
  setIsLoading: (v) => set({ isLoading: v }),
  error: null,
  setError: (v) => set({ error: v }),
}))