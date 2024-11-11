"use client"

import { ListingsTable } from '@/components/table/ListingsTable'
import { FiPlus } from 'react-icons/fi'
import { useListingsStore } from '@/stores/listingsStore'
import { HouseListing } from '@/types'
import { ActionsMenu } from '@/components/ActionsMenu'

export default function Home() {
  const addListing = useListingsStore(state => state.addListing)
  const setSelectedListing = useListingsStore(state => state.setSelectedListing)

  const handleNewPad = () => {
    const newListing: HouseListing = {
      id: crypto.randomUUID(),
      address: '',
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      squareFeet: 0,
      availability: new Date().toISOString(),
      dateAdded: new Date().toISOString(),
      link: '',
      rating: 0,
      notes: ''
    }
    addListing(newListing)
    setSelectedListing(newListing.id)
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Brillow</h1>
        <div className="flex gap-2">
          <ActionsMenu />
          <button 
            onClick={handleNewPad}
            className="button-new-pad"
          >
            <FiPlus className="w-4 h-4" />
            New Pad
          </button>
        </div>
      </div>
      <ListingsTable />
    </main>
  )
}
