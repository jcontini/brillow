import { CellContext, RowData } from '@tanstack/react-table'

// Listing Types
export interface HouseListing {
  id?: string
  rating: number
  link: string
  neighborhood: string
  address: string
  bedrooms: number
  bathrooms: number
  price: number
  squareFeet: number
  unit: string
  availability: string
  notes: string
  dateAdded: string
  coordinates?: Coordinates | null
}

export interface Coordinates {
  lat: number
  lng: number
}

// Store Types
export interface ListingsState {
  listings: HouseListing[]
  importListings: (newListings: HouseListing[]) => void
  appendListings: (newListings: HouseListing[]) => void
  addListing: (listing: HouseListing) => void
  removeListing: (id: string) => void
  updateListing: (id: string, updates: Partial<HouseListing>) => void
}

export interface SettingsState {
  columnOrder: string[]
  currency: string
  setColumnOrder: (order: string[]) => void
  setCurrency: (currency: string) => void
}

export interface TerminalState {
  messages: LogMessage[]
  addLog: (text: string, type: LogType) => void
  clear: () => void
}

export type LogType = 'info' | 'success' | 'error'

export interface LogMessage {
  text: string
  type: LogType
  timestamp: number
}

// Component Props Types
export interface StarRatingProps {
  rating: number
  onChange?: (rating: number) => void
  colorMode?: 'gradient'
}

export interface PropertyDetailsProps {
  listing: HouseListing | null
}

// Table Types
export interface ColumnMeta<TData extends RowData, TValue> {
  getCellStyles?: (
    value: TValue,
    context: CellContext<TData, TValue>
  ) => React.CSSProperties
  isNumeric?: boolean
  isCurrency?: boolean
  isDate?: boolean
}

export interface TableColumn<TData extends RowData> {
  id: string
  header: string
  accessorKey: keyof TData
  meta?: ColumnMeta<TData, unknown>
}

export interface SortingState {
  id: string
  desc: boolean
}

export interface TableState {
  sorting: SortingState[]
  columnVisibility: Record<string, boolean>
  columnOrder: string[]
}

// TanStack Table type augmentation
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    getCellStyles?: (
      value: TValue,
      context: CellContext<TData, TValue>
    ) => React.CSSProperties
    isNumeric?: boolean
    isCurrency?: boolean
    isDate?: boolean
  }
}

// Re-export necessary types from @tanstack/react-table
export type { 
  ColumnDef,
  CellContext,
  RowData
} from '@tanstack/react-table'

// We can add more component prop interfaces here as needed 