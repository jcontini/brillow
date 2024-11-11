"use client"

import { HouseListing } from "@/types"
import { StarRating } from "./StarRating"
import { useListingsStore } from "@/stores/listingsStore"
import { format } from "date-fns"
import { SiZillow, SiTrulia } from "react-icons/si"
import { FaFacebookSquare } from "react-icons/fa"
import { FiExternalLink } from "react-icons/fi"

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
  
  if (!listing) return null

  const handleChange = (field: keyof HouseListing, value: any) => {
    if (listing.id) {
      updateListing(listing.id, { [field]: value })
    }
  }

  return (
    <div className="property-details-panel">
      <h3>Property Details</h3>
      
      <div className="details-grid">
        <div className="detail-item">
          <label>Rating</label>
          <StarRating 
            rating={listing.rating}
            onChange={(newRating) => handleChange('rating', newRating)}
          />
        </div>

        <div className="detail-item">
          <label>Address</label>
          <input
            type="text"
            value={listing.address}
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
            value={listing.neighborhood}
            onChange={e => handleChange('neighborhood', e.target.value)}
            className="edit-input"
          />
        </div>

        <div className="detail-item">
          <label>Price</label>
          <input
            type="number"
            value={listing.price}
            onChange={e => handleChange('price', Number(e.target.value))}
            className="edit-input"
          />
        </div>

        <div className="detail-item">
          <label>Size</label>
          <input
            type="number"
            value={listing.squareFeet}
            onChange={e => handleChange('squareFeet', Number(e.target.value))}
            className="edit-input"
          />
        </div>

        <div className="detail-item">
          <label>Beds / Baths</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={listing.bedrooms}
              onChange={e => handleChange('bedrooms', Number(e.target.value))}
              className="edit-input w-20"
            />
            <span className="self-center">/</span>
            <input
              type="number"
              value={listing.bathrooms}
              onChange={e => handleChange('bathrooms', Number(e.target.value))}
              className="edit-input w-20"
            />
          </div>
        </div>

        <div className="detail-item">
          <label>Available</label>
          <input
            type="date"
            value={listing.availability.split('T')[0]}
            onChange={e => handleChange('availability', e.target.value)}
            className="edit-input"
          />
        </div>

        <div className="detail-item notes">
          <label>Notes</label>
          <textarea
            value={listing.notes}
            onChange={e => handleChange('notes', e.target.value)}
            className="edit-input min-h-[100px]"
          />
        </div>
      </div>
    </div>
  )
} 