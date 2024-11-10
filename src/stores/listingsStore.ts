import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { HouseListing } from '@/types'

interface ListingsState {
  listings: HouseListing[]
  importListings: (newListings: HouseListing[]) => void
  addListing: (listing: HouseListing) => void
  removeListing: (id: string) => void
  updateListing: (id: string, updates: Partial<HouseListing>) => void
}

export const useListingsStore = create<ListingsState>()(
  persist(
    (set) => ({
      listings: [],
      importListings: (newListings) => set({ listings: newListings }),
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