import { HouseListing } from "@/types"
import { StarRating } from "./StarRating"
import { useListingsStore } from "@/stores/listingsStore"

interface PropertyDetailsProps {
  listing: HouseListing | null
}

export const PropertyDetails = ({ listing }: PropertyDetailsProps) => {
  const updateListing = useListingsStore(state => state.updateListing)
  
  if (!listing) return null

  return (
    <div className="property-details-panel">
      <h3>Property Details</h3>
      
      <div className="details-grid">
        <div className="detail-item">
          <label>Rating</label>
          <StarRating 
            rating={listing.rating}
            onChange={(newRating) => {
              if (listing.id) {
                updateListing(listing.id, { rating: newRating })
              }
            }}
          />
        </div>

        <div className="detail-item">
          <label>Address</label>
          <a 
            href={listing.link}
            target="_blank"
            rel="noopener noreferrer"
            className="table-link"
          >
            {listing.address}
          </a>
        </div>

        <div className="detail-item">
          <label>Neighborhood</label>
          <span>{listing.neighborhood}</span>
        </div>

        <div className="detail-item">
          <label>Price</label>
          <span>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(listing.price)}
          </span>
        </div>

        <div className="detail-item">
          <label>Size</label>
          <span>{listing.squareFeet} sq.ft</span>
        </div>

        <div className="detail-item">
          <label>Beds / Baths</label>
          <span>{listing.bedrooms} bed / {listing.bathrooms} bath</span>
        </div>

        <div className="detail-item">
          <label>Available</label>
          <span>{new Date(listing.availability).toLocaleDateString()}</span>
        </div>

        <div className="detail-item">
          <label>Added</label>
          <span>{new Date(listing.dateAdded).toLocaleDateString()}</span>
        </div>

        {listing.notes && (
          <div className="detail-item notes">
            <label>Notes</label>
            <p>{listing.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
} 