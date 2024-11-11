'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useListingsStore } from '@/stores/listingsStore'
import { useTerminalStore } from '@/stores/terminalStore'
import { getRatingColor } from '@/utils/colors'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

// Helper function to format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

interface MapProps {
  className?: string
}

export function Map({ className = '' }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({})
  const popupsRef = useRef<{ [key: string]: mapboxgl.Popup }>({})
  
  const listings = useListingsStore(state => state.listings)
  const selectedListingId = useListingsStore(state => state.selectedListingId)
  const setSelectedListing = useListingsStore(state => state.setSelectedListing)
  const addLog = useTerminalStore(state => state.addLog)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return

    addLog('Initializing map...', 'info')
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-97.7431, 30.2672],
      zoom: 11,
      collectResourceTiming: false
    })

    return () => {
      // Clean up all markers and popups
      Object.values(markersRef.current).forEach(marker => marker.remove())
      Object.values(popupsRef.current).forEach(popup => popup.remove())
      map.current?.remove()
    }
  }, [addLog])

  // Handle markers and popups
  useEffect(() => {
    if (!map.current) return

    addLog('Updating markers...', 'info')

    // Track which listings still exist
    const currentListingIds = new Set(listings.map(l => l.id))
    
    // Remove markers and popups for listings that no longer exist
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      if (!currentListingIds.has(id)) {
        marker.remove()
        delete markersRef.current[id]
        if (popupsRef.current[id]) {
          popupsRef.current[id].remove()
          delete popupsRef.current[id]
        }
      }
    })

    // Update or create markers for current listings
    listings.forEach(listing => {
      if (listing.coordinates) {
        try {
          // Create or update marker
          let marker = markersRef.current[listing.id]
          if (!marker) {
            marker = new mapboxgl.Marker({
              color: getRatingColor(listing.rating || 0),
              anchor: 'bottom'
            })
            .setLngLat([listing.coordinates.lng, listing.coordinates.lat])
            .addTo(map.current!)

            // Add click handler
            marker.getElement().addEventListener('click', () => {
              setSelectedListing(listing.id === selectedListingId ? null : listing.id)
            })

            markersRef.current[listing.id] = marker
          } else {
            // Update existing marker
            marker.setLngLat([listing.coordinates.lng, listing.coordinates.lat])
          }

          // Create or update popup
          let popup = popupsRef.current[listing.id]
          if (!popup) {
            const borderColor = getRatingColor(listing.rating || 0)
            
            popup = new mapboxgl.Popup({
              offset: [0, -38],
              closeButton: false,
              closeOnClick: true,
              maxWidth: '300px',
              className: `dark-theme-popup rating-${listing.rating || 0}`,
              anchor: 'bottom'
            })
            .setHTML(`
              <div class="popup-content" style="--rating-color: ${borderColor}">
                <div class="popup-address">${listing.address}</div>
                <div class="popup-details">
                  ${formatPrice(listing.price)} · 
                  ${listing.bedrooms} bed${listing.bedrooms !== 1 ? 's' : ''} · 
                  ${listing.bathrooms} bath${listing.bathrooms !== 1 ? 's' : ''}
                </div>
              </div>
            `)

            popupsRef.current[listing.id] = popup
          }

          // Show/hide popup based on selection
          if (listing.id === selectedListingId) {
            marker.setPopup(popup)
            if (!popup.isOpen()) {
              popup.addTo(map.current!)
            }
          } else {
            popup.remove()
          }

        } catch (error) {
          addLog(`Error handling marker/popup for ${listing.address}: ${error}`, 'error')
        }
      }
    })
  }, [listings, selectedListingId, setSelectedListing, addLog])

  // Pan the map to the selected marker
  useEffect(() => {
    if (!map.current || !selectedListingId) return

    const selectedListing = listings.find(listing => listing.id === selectedListingId)

    if (selectedListing?.coordinates) {
      map.current.flyTo({
        center: [selectedListing.coordinates.lng, selectedListing.coordinates.lat],
        zoom: 11,
        essential: true,
        duration: 500
      })
    }
  }, [selectedListingId, listings])

  return (
    <div className="map-container">
      <div ref={mapContainer} className={`h-full ${className}`} />
    </div>
  )
} 