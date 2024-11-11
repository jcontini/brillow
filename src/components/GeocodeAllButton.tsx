'use client'

import { useListingsStore } from "@/stores/listingsStore"
import { useTerminalStore } from "@/stores/terminalStore"
import { useState } from "react"
import { geocodeAddress } from "@/utils/geocoding"
import { FiMapPin } from "react-icons/fi"

export function GeocodeAllButton() {
  const [isGeocoding, setIsGeocoding] = useState(false)
  const listings = useListingsStore(state => state.listings)
  const updateListing = useListingsStore(state => state.updateListing)
  const addLog = useTerminalStore(state => state.addLog)

  const handleGeocodeAll = async () => {
    setIsGeocoding(true)
    let geocoded = 0
    
    try {
      addLog('Starting batch geocoding...', 'info')
      
      for (const listing of listings) {
        if (!listing.coordinates && listing.address) {
          addLog(`Geocoding: ${listing.address}`, 'info')
          const coordinates = await geocodeAddress(listing.address)
          
          if (coordinates && listing.id) {
            updateListing(listing.id, { coordinates })
            geocoded++
            addLog(`✓ Found coordinates for ${listing.address}`, 'success')
            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100))
          } else {
            addLog(`✗ No coordinates found for ${listing.address}`, 'error')
          }
        }
      }
      
      addLog(`Geocoding complete. Successfully geocoded ${geocoded} listings`, 'success')
    } catch (error) {
      addLog(`Error geocoding listings: ${error}`, 'error')
    } finally {
      setIsGeocoding(false)
    }
  }

  return (
    <button
      onClick={handleGeocodeAll}
      disabled={isGeocoding}
      className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FiMapPin className="w-4 h-4" />
      <span>{isGeocoding ? 'Geocoding...' : 'Geocode All'}</span>
    </button>
  )
} 