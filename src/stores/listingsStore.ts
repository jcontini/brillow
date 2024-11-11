import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ListingsState, HouseListing } from '@/types'

export const useListingsStore = create<ListingsState>()(
  persist(
    (set) => ({
      listings: [],
      importListings: (newListings) => set({ listings: newListings }),
      appendListings: (newListings) => set((state) => {
        const existingIds = new Set(state.listings.map(l => l.id))
        const uniqueNewListings = newListings.filter(l => !existingIds.has(l.id))
        return { listings: [...state.listings, ...uniqueNewListings] }
      }),
      addListing: (listing) => 
        set((state) => ({ listings: [...state.listings, listing] })),
      removeListing: (id) =>
        set((state) => ({ 
          listings: state.listings.filter(listing => listing.id !== id) 
        })),
      updateListing: (id, updates) =>
        set((state) => ({
          listings: state.listings.map(listing =>
            listing.id === id ? { ...listing, ...updates } : listing
          )
        })),
    }),
    {
      name: 'listings-storage',
      version: 1,
    }
  )
)