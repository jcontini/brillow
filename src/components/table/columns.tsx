import { ColumnDef } from '@tanstack/react-table'
import { HouseListing } from '@/types'
import { StarRating } from '../StarRating'
import { formatPrice, formatDate } from '../../utils/format'
import { SiZillow, SiTrulia } from "react-icons/si"
import { FaFacebookSquare } from "react-icons/fa"
import { FiExternalLink } from "react-icons/fi"
import { IoBedOutline } from "react-icons/io5"
import { LuBath } from "react-icons/lu"
import { AiOutlineExpand } from "react-icons/ai"

const getLinkIcon = (url: string) => {
  if (url.includes('zillow.com')) return <SiZillow className="w-4 h-4" />
  if (url.includes('trulia.com')) return <SiTrulia className="w-4 h-4" />
  if (url.includes('facebook.com')) return <FaFacebookSquare className="w-4 h-4" />
  return <FiExternalLink className="w-4 h-4" />
}

export const columns: ColumnDef<HouseListing>[] = [
  {
    id: 'mainInfo',
    header: 'Property',
    accessorFn: row => row,
    cell: info => {
      const listing = info.getValue() as HouseListing
      return (
        <div className="table-cell-content">
          <div className="table-cell-main flex items-center gap-2">
            <span className="opacity-50">
              {getLinkIcon(listing.link)}
            </span>
            {listing.address}
          </div>
          <div className="table-cell-details">
            <div className="table-cell-detail-item">
              <IoBedOutline className="w-3.5 h-3.5" />
              {listing.bedrooms}
            </div>
            <div className="table-cell-detail-item">
              <LuBath className="w-3.5 h-3.5" />
              {listing.bathrooms}
            </div>
            <div className="table-cell-detail-item">
              <AiOutlineExpand className="w-3.5 h-3.5" />
              {listing.squareFeet.toLocaleString()} ft²
            </div>
          </div>
        </div>
      )
    },
    size: 250,
  },
  {
    id: 'priceInfo',
    header: 'Price',
    accessorFn: row => row,
    cell: info => {
      const listing = info.getValue() as HouseListing
      const pricePerSqFt = listing.price / listing.squareFeet
      return (
        <div className="table-cell-content">
          <div className="table-cell-main">{formatPrice(listing.price)}</div>
          <div className="table-cell-details">
            ${pricePerSqFt.toFixed(2)}/ft²
          </div>
        </div>
      )
    },
    size: 120,
  },
  {
    id: 'rating',
    header: 'Interior',
    accessorKey: 'rating',
    cell: info => (
      <div className="table-cell-content">
        <StarRating 
          rating={Number(info.getValue()) ?? 0}
          colorMode="gradient"
          onChange={(newRating) => {
            const id = (info.row.original as HouseListing).id
            if (id) {
              // Your rating update logic here
            }
          }}
        />
      </div>
    ),
    size: 120,
  }
]