'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useListingsStore } from '@/stores/listingsStore'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

// Rating to color mapping function
const getRatingColor = (rating: number): string => {
  switch (rating) {
    case 5: return '#22c55e' // Green for 5 stars
    case 4: return '#3b82f6' // Blue for 4 stars
    case 3: return '#f59e0b' // Yellow/Orange for 3 stars
    case 2: return '#ef4444' // Red for 2 stars
    case 1: return '#7f1d1d' // Dark red for 1 star
    default: return '#6b7280' // Gray for no rating
  }
}

interface MapProps {
  className?: string
}

export function Map({ className = '' }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])
  const listings = useListingsStore(state => state.listings)

  useEffect(() => {
    if (!mapContainer.current) return

    console.log('Initializing map')
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-97.7431, 30.2672], // Austin coordinates
      zoom: 11
    })

    return () => {
      map.current?.remove()
    }
  }, [])

  // Update markers when listings change
  useEffect(() => {
    if (!map.current) return

    console.log('Updating markers for listings:', listings)

    // Clear existing markers
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    // Add new markers
    listings.forEach(listing => {
      if (listing.coordinates) {
        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <strong>${listing.address}</strong><br>
            $${listing.price}/mo<br>
            ${listing.bedrooms} beds, ${listing.bathrooms} baths
          `)

        // Create marker with rating-based color
        const marker = new mapboxgl.Marker({
          color: getRatingColor(listing.rating || 0),
          scale: 0.8
        })
          .setLngLat([listing.coordinates.lng, listing.coordinates.lat])
          .setPopup(popup)
          .addTo(map.current!)

        markers.current.push(marker)
      }
    })
  }, [listings])

  return (
    <div className="map-container">
      <div ref={mapContainer} className={`h-full ${className}`} />
    </div>
  )
} 