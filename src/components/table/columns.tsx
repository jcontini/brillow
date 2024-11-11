import { createColumnHelper, ColumnDef } from "@tanstack/react-table"
import { HouseListing } from "@/types"
import { StarRating } from "../StarRating"
import { format } from "date-fns"
import { SiZillow, SiTrulia } from "react-icons/si"
import { FaFacebookSquare, FaShower } from "react-icons/fa"
import { IoBedOutline } from "react-icons/io5"
import { FiExternalLink } from "react-icons/fi"
import { RealtorIcon } from '../icons/RealtorIcon'

// Update the ColumnMeta interface with proper generic types
export interface ColumnMeta {
  getCellStyles?: (value: any) => React.CSSProperties
}

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

const getPricePerSqFtColor = (value: number | null) => {
  if (value === null) return ''
  
  // Adjust these thresholds based on your market
  const minValue = 1.0   // Best value - most blue
  const maxValue = 3.0   // Worst value - no color
  
  // Calculate opacity based on where the value falls in the range
  const opacity = Math.max(0, Math.min(1, 
    1 - ((value - minValue) / (maxValue - minValue))
  ))
  
  // Return background color with calculated opacity
  return `rgba(96, 165, 250, ${opacity * 0.2})` // Using accent blue with dynamic opacity
}

const getValueBasedColor = (
  value: number, 
  values: number[], 
  { reverse = false }: { reverse?: boolean } = {}
) => {
  if (!value || !values.length) return ''
  
  const min = Math.min(...values)
  const max = Math.max(...values)
  
  if (min === max) return ''
  
  // Calculate opacity based on where the value falls in the range
  let opacity = (value - min) / (max - min)
  
  // Reverse the opacity if needed (e.g., for price/sqft where lower is better)
  if (reverse) opacity = 1 - opacity
  
  // Return background color with calculated opacity
  return `rgba(96, 165, 250, ${opacity * 0.2})`
}

export const columns = [
  columnHelper.accessor("address", {
    header: "Pad",
    cell: info => {
      const address = info.getValue()
      const url = info.row.original.link
      return (
        <div className="flex items-center gap-2">
          <span className="text-accent-blue opacity-75">
            {getLinkIcon(url)}
          </span>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="table-link"
          >
            {address}
          </a>
        </div>
      )
    }
  }),
  columnHelper.accessor("rating", {
    header: "Rating",
    cell: info => (
      <StarRating 
        rating={info.getValue()}
        onChange={undefined}
        colorMode="gradient"
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
    ),
    meta: {
      getCellStyles: (value: number, context: any) => {
        const allValues = context.table.options.data
          .map((row: HouseListing) => row.bedrooms)
          .filter(Boolean)
        
        return {
          backgroundColor: getValueBasedColor(value, allValues)
        }
      }
    }
  }),
  columnHelper.accessor("bathrooms", {
    header: "Baths",
    cell: info => (
      <div className="flex items-center gap-1">
        <FaShower className="w-3.5 h-3.5 opacity-75" />
        <span>{info.getValue()}</span>
      </div>
    ),
    meta: {
      getCellStyles: (value: number, context: any) => {
        const allValues = context.table.options.data
          .map((row: HouseListing) => row.bathrooms)
          .filter(Boolean)
        
        return {
          backgroundColor: getValueBasedColor(value, allValues)
        }
      }
    }
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
    cell: info => new Intl.NumberFormat('en-US').format(info.getValue())
  }),
  columnHelper.accessor(row => {
    if (!row.price || !row.squareFeet || row.squareFeet === 0) return null
    return row.price / row.squareFeet
  }, {
    id: 'pricePerSqFt',
    header: '$/ft²',
    size: 100,
    cell: info => {
      const value = info.getValue()
      if (value === null) return '-'
      return `$${value.toFixed(2)}`
    },
    meta: {
      getCellStyles: (value: number | null, context: any) => {
        if (value === null) return {}
        
        const allValues = context.table.options.data
          .map((row: HouseListing) => 
            row.price && row.squareFeet ? row.price / row.squareFeet : null
          )
          .filter((v: number | null): v is number => v !== null)
        
        return {
          backgroundColor: getValueBasedColor(value, allValues, { reverse: true })
        }
      }
    }
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
  }),
]