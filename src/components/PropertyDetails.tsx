"use client"

import { useState, useEffect } from "react"
import { HouseListing } from "@/types"
import { StarRating } from "./StarRating"
import { useListingsStore } from "@/stores/listingsStore"
import { SiZillow, SiTrulia } from "react-icons/si"
import { FaFacebookSquare } from "react-icons/fa"
import { FiExternalLink, FiMapPin } from "react-icons/fi"

interface PropertyDetailsProps {
  listing: HouseListing | null
}

const getLinkIcon = (url: string) => {
  if (url.includes('zillow.com')) return <SiZillow className="w-4 h-4" />
  if (url.includes('trulia.com')) return <SiTrulia className="w-4 h-4" />
  if (url.includes('facebook.com')) return <FaFacebookSquare className="w-4 h-4" />
  if (url.includes('realtor.com')) return <FiExternalLink className="w-4 h-4" />
  return <FiExternalLink className="w-4 h-4" />
}

export const PropertyDetails = ({ listing }: PropertyDetailsProps) => {
  const updateListing = useListingsStore(state => state.updateListing)
  const [localValues, setLocalValues] = useState<Partial<HouseListing>>({})
  
  if (!listing) return null

  useEffect(() => {
    setLocalValues(listing)
  }, [listing])

  const handleGeocode = async () => {
    if (!listing.address) {
      console.log('No address provided')
      return
    }
    
    console.log('Attempting to geocode address:', listing.address)
    
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(listing.address)}.json?` + 
        new URLSearchParams({
          access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
          limit: '1',
          types: 'address'
        })
      
      console.log('Geocoding URL:', url)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        console.error('Geocoding response not OK:', response.status, response.statusText)
        throw new Error('Geocoding failed')
      }
      
      const data = await response.json()
      console.log('Geocoding response:', data)
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates
        console.log('Found coordinates:', { lng, lat })
        updateListing(listing.id!, { coordinates: { lng, lat } })
      } else {
        console.log('No geocoding results found')
        throw new Error('No results found')
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      updateListing(listing.id!, { coordinates: null })
    }
  }

  const handleChange = (field: keyof HouseListing, value: any) => {
    setLocalValues(prev => ({
      ...prev,
      [field]: value
    }))
    updateListing(listing.id!, { [field]: value })
  }

  return (
    <div className="property-details-panel">
      <h3>Pad Details</h3>
      
      <div className="details-grid">
        <div className="detail-item">
          <label>Interior</label>
          <StarRating 
            rating={localValues.rating ?? listing.rating}
            onChange={(newRating) => handleChange('rating', newRating)}
            colorMode="gradient"
          />
        </div>

        <div className="detail-item">
          <label>Address</label>
          <input
            type="text"
            value={localValues.address ?? listing.address}
            onChange={e => handleChange('address', e.target.value)}
            className="edit-input"
          />
          <a 
            href={listing.link}
            target="_blank"
            rel="noopener noreferrer"
            className="table-link text-sm mt-1 flex items-center gap-2"
          >
            <span>View Listing</span>
            <span className="opacity-75">
              {getLinkIcon(listing.link)}
            </span>
          </a>
        </div>

        <div className="detail-item">
          <label>Neighborhood</label>
          <input
            type="text"
            value={localValues.neighborhood ?? listing.neighborhood ?? ''}
            onChange={e => handleChange('neighborhood', e.target.value)}
            className="edit-input"
          />
        </div>

        <div className="detail-item">
          <label>Price</label>
          <input
            type="number"
            value={localValues.price ?? listing.price}
            onChange={e => handleChange('price', Number(e.target.value))}
            className="edit-input"
            style={{ appearance: 'textfield' }}
          />
        </div>

        <div className="detail-item">
          <label>Size</label>
          <input
            type="number"
            value={localValues.squareFeet ?? listing.squareFeet}
            onChange={e => handleChange('squareFeet', Number(e.target.value))}
            className="edit-input"
            style={{ appearance: 'textfield' }}
          />
        </div>

        <div className="detail-item">
          <label>Beds / Baths</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={localValues.bedrooms ?? listing.bedrooms}
              onChange={e => handleChange('bedrooms', Number(e.target.value))}
              className="edit-input w-20"
              style={{ appearance: 'textfield' }}
            />
            <span className="self-center">/</span>
            <input
              type="number"
              value={localValues.bathrooms ?? listing.bathrooms}
              onChange={e => handleChange('bathrooms', Number(e.target.value))}
              className="edit-input w-20"
              style={{ appearance: 'textfield' }}
            />
          </div>
        </div>

        <div className="detail-item">
          <label>Available</label>
          <input
            type="date"
            value={localValues.availability?.split('T')[0] ?? listing.availability.split('T')[0]}
            onChange={e => handleChange('availability', e.target.value)}
            className="edit-input"
          />
        </div>

        <div className="detail-item notes">
          <label>Notes</label>
          <textarea
            value={localValues.notes ?? listing.notes}
            onChange={e => handleChange('notes', e.target.value)}
            className="edit-input min-h-[100px]"
          />
        </div>

        <div className="detail-item">
          <label>Coordinates</label>
          {listing.coordinates === undefined ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">Not geocoded</span>
              <button
                onClick={handleGeocode}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FiMapPin className="w-3 h-3" />
                <span>Geocode</span>
              </button>
            </div>
          ) : listing.coordinates === null ? (
            <span className="text-red-500 text-sm">Geocoding failed</span>
          ) : (
            <div className="text-sm space-y-1">
              <div>Lat: {listing.coordinates.lat.toFixed(6)}</div>
              <div>Lng: {listing.coordinates.lng.toFixed(6)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 