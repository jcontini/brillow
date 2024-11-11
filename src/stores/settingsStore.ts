import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SettingsState } from '@/types'

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