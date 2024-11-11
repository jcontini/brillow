import { createColumnHelper } from "@tanstack/react-table"
import { HouseListing } from "@/types"
import { StarRating } from "../StarRating"
import { format } from "date-fns"
import { SiZillow, SiTrulia } from "react-icons/si"
import { FaFacebookSquare, FaShower } from "react-icons/fa"
import { IoBedOutline } from "react-icons/io5"
import { FiExternalLink } from "react-icons/fi"
import { RealtorIcon } from '../icons/RealtorIcon'

const columnHelper = createColumnHelper<HouseListing>()

const getLinkIcon = (url: string) => {
  if (url.includes('zillow.com')) return <SiZillow className="w-4 h-4" />
  if (url.includes('trulia.com')) return <SiTrulia className="w-4 h-4" />
  if (url.includes('facebook.com')) return <FaFacebookSquare className="w-4 h-4" />
  if (url.includes('realtor.com')) return <RealtorIcon />
  return <FiExternalLink className="w-4 h-4" />
}

const formatDate = (dateStr: string) => {
  try {
    return format(new Date(dateStr), 'MMM d')
  } catch {
    return ''
  }
}

export const columns = [
  columnHelper.accessor("address", {
    header: "Address",
    cell: info => {
      const address = info.getValue()
      const url = info.row.original.link
      return (
        <div className="flex items-center gap-2">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="table-link"
          >
            {address}
          </a>
          <span className="text-accent-blue opacity-75">
            {getLinkIcon(url)}
          </span>
        </div>
      )
    }
  }),
  columnHelper.accessor("rating", {
    header: "Rating",
    cell: info => (
      <StarRating 
        rating={info.getValue()}
        onChange={undefined}  // We'll handle this in the table component
      />
    )
  }),
  columnHelper.accessor("bedrooms", {
    header: "Beds",
    cell: info => (
      <div className="flex items-center gap-1">
        <IoBedOutline className="w-4 h-4 opacity-75" />
        <span>{info.getValue()}</span>
      </div>
    )
  }),
  columnHelper.accessor("bathrooms", {
    header: "Baths",
    cell: info => (
      <div className="flex items-center gap-1">
        <FaShower className="w-3.5 h-3.5 opacity-75" />
        <span>{info.getValue()}</span>
      </div>
    )
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: info => {
      const amount = info.getValue()
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }
  }),
  columnHelper.accessor("squareFeet", {
    header: "Sq.Ft",
    cell: info => info.getValue()
  }),
  columnHelper.accessor("availability", {
    header: "Available",
    cell: info => formatDate(info.getValue()),
    sortingFn: 'datetime'
  }),
  columnHelper.accessor("dateAdded", {
    header: "Added",
    cell: info => formatDate(info.getValue()),
    sortingFn: 'datetime'
  })
]