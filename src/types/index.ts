import type { ColumnMeta as TanStackColumnMeta } from '@tanstack/react-table'

export interface HouseListing {
    id?: string
    rating: number          // 1-5 stars
    link: string           // URL
    neighborhood: string
    address: string
    bedrooms: number
    bathrooms: number
    price: number          // Numeric value
    squareFeet: number
    availability: string   // ISO date format
    notes: string
    dateAdded: string     // ISO date format
    coordinates?: {
        lat: number
        lng: number
    } | null  // null indicates geocoding failed, undefined means not tried yet
}

export interface AppState {
    version: string
    exportedAt: string     // ISO date format
    settings: {
        columnOrder: string[]
        currency: string    // ISO 4217 currency code (e.g., "USD")
    }
    data: {
        listings: HouseListing[]
    }
}

// Update the type augmentation to include cell context
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends unknown, TValue> {
    getCellStyles?: (value: TValue, context: any) => React.CSSProperties
  }
} 