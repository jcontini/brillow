import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  columnOrder: string[]
  currency: string
  setColumnOrder: (order: string[]) => void
  setCurrency: (currency: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      columnOrder: ['rating', 'link', 'neighborhood', 'address', 'bedrooms', 'bathrooms', 'price', 'squareFeet', 'unit', 'availability', 'notes', 'dateAdded'],
      currency: 'USD',
      setColumnOrder: (order) => set({ columnOrder: order }),
      setCurrency: (currency) => set({ currency: currency }),
    }),
    {
      name: 'settings-storage',
    }
  )
) 