import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { HouseListing } from "@/types"

// Create a column helper with the correct type
const columnHelper = createColumnHelper<HouseListing>()

export const columns = [
  columnHelper.accessor("rating", {
    header: "Rating",
    // We'll implement the star rating UI later
  }),
  columnHelper.accessor("link", {
    header: "Link",
    cell: ({ getValue }) => {
      const url = getValue()
      try {
        const domain = new URL(url).hostname.replace('www.', '').split('.')[0]
        const identifier = url.split('/').pop()
        return (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="table-link"
          >
            {`${domain.charAt(0).toUpperCase() + domain.slice(1)}//${identifier}`}
          </a>
        )
      } catch {
        return ''
      }
    }
  }),
  columnHelper.accessor("neighborhood", {
    header: "Neighborhood",
  }),
  columnHelper.accessor("address", {
    header: "Address",
  }),
  columnHelper.accessor("bedrooms", {
    header: "Beds",
  }),
  columnHelper.accessor("bathrooms", {
    header: "Baths",
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: ({ getValue }) => {
      const amount = getValue()
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
    }
  }),
  columnHelper.accessor("squareFeet", {
    header: "Sq.Ft",
  }),
  columnHelper.accessor("unit", {
    header: "Unit",
  }),
  columnHelper.accessor("availability", {
    header: "Available",
    cell: ({ getValue }) => {
      const date = getValue()
      try {
        return new Date(date).toLocaleDateString()
      } catch {
        return ''
      }
    }
  }),
  columnHelper.accessor("notes", {
    header: "Notes",
  }),
  columnHelper.accessor("dateAdded", {
    header: "Added",
    cell: ({ getValue }) => {
      const date = getValue()
      try {
        return new Date(date).toLocaleDateString()
      } catch {
        return ''
      }
    }
  }),
] as ColumnDef<HouseListing, unknown>[] 