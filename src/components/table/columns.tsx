import { createColumnHelper } from "@tanstack/react-table"
import { HouseListing } from "@/types"
import { StarRating } from "../StarRating"

const columnHelper = createColumnHelper<HouseListing>()

export const columns = [
  columnHelper.accessor("address", {
    header: "Address",
    cell: info => {
      const address = info.getValue()
      const url = info.row.original.link
      return (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="table-link"
        >
          {address}
        </a>
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
    cell: info => info.getValue()
  }),
  columnHelper.accessor("bathrooms", {
    header: "Baths",
    cell: info => info.getValue()
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
    cell: info => {
      const date = info.getValue()
      try {
        return new Date(date).toLocaleDateString()
      } catch {
        return ''
      }
    }
  }),
  columnHelper.accessor("dateAdded", {
    header: "Added",
    cell: info => {
      const date = info.getValue()
      try {
        return new Date(date).toLocaleDateString()
      } catch {
        return ''
      }
    }
  })
]