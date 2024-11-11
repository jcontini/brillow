'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useListingsStore } from '@/stores/listingsStore'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

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
        console.log('Adding marker for listing:', listing.address, listing.coordinates)
        const marker = new mapboxgl.Marker()
          .setLngLat([listing.coordinates.lng, listing.coordinates.lat])
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