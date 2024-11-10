import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { HouseListing } from '@/types'

interface ListingsState {
  listings: HouseListing[]
  importListings: (newListings: HouseListing[]) => void
  addListing: (listing: HouseListing) => void
  removeListing: (id: string) => void
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
    }),
    {
      name: 'listings-storage', // unique name for localStorage key
      version: 1, // useful for migrations if we change the structure later
    }
  )
)