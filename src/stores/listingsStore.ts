import { create } from 'zustand'
import { HouseListing } from '@/types'

interface ListingsState {
  listings: HouseListing[]
  addListing: (listing: HouseListing) => void
  removeListing: (id: string) => void
}

// Sample data
const sampleListings: HouseListing[] = [
  {
    id: '1',
    rating: 4,
    link: 'https://www.zillow.com/homedetails/123',
    neighborhood: 'Downtown',
    address: '123 Main St',
    bedrooms: 2,
    bathrooms: 2,
    price: 500000,
    squareFeet: 1200,
    unit: '4B',
    availability: '2024-05-01',
    notes: 'Great view of the city',
    dateAdded: '2024-03-20'
  },
  {
    id: '2',
    rating: 3,
    link: 'https://www.redfin.com/property/456',
    neighborhood: 'West Side',
    address: '456 Oak Ave',
    bedrooms: 3,
    bathrooms: 2.5,
    price: 750000,
    squareFeet: 1800,
    unit: null,
    availability: '2024-04-15',
    notes: 'Recently renovated',
    dateAdded: '2024-03-19'
  },
]

export const useListingsStore = create<ListingsState>((set) => ({
  listings: sampleListings, // Initialize with sample data
  addListing: (listing) => 
    set((state) => ({ listings: [...state.listings, listing] })),
  removeListing: (id) =>
    set((state) => ({ 
      listings: state.listings.filter(listing => listing.id !== id) 
    })),
})) 