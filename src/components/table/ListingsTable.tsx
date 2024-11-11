'use client'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  flexRender
} from '@tanstack/react-table'
import { FiChevronUp, FiChevronDown } from 'react-icons/fi'
import { HouseListing } from '@/types'
import { useListingsStore } from '@/stores/listingsStore'
import { columns } from './columns'
import { useState, useMemo, useEffect } from 'react'
import { PropertyDetails } from '../PropertyDetails'
import { StarRating } from '../StarRating'
import { Map } from '../Map'

export function ListingsTable() {
  const listings = useListingsStore((state) => state.listings)
  const selectedListingId = useListingsStore((state) => state.selectedListingId)
  const setSelectedListing = useListingsStore((state) => state.setSelectedListing)
  const updateListing = useListingsStore((state) => state.updateListing)
  const data = useMemo(() => listings, [listings])
  
  const [columnSizing, setColumnSizing] = useState({})
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'rating', desc: true },  // Primary sort: rating descending
    { id: 'price', desc: false }   // Secondary sort: price ascending
  ])

  const table = useReactTable<HouseListing>({
    data,
    columns: columns.map(col => {
      if (col.id === 'rating') {
        return {
          ...col,
          cell: info => (
            <StarRating 
              rating={info.getValue()}
              colorMode="gradient"
              onChange={(newRating) => {
                const id = info.row.original.id
                if (id) {
                  updateListing(id, { rating: newRating })
                }
              }}
            />
          )
        }
      }
      return col
    }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
    state: {
      sorting,
      columnSizing,
    },
    onSortingChange: setSorting,
    onColumnSizingChange: setColumnSizing,
  })

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const rows = table.getRowModel().rows
      if (!rows.length) return
      
      const currentIndex = selectedListingId 
        ? rows.findIndex(row => row.original.id === selectedListingId)
        : -1

      if (e.key === 'j') {
        // Move down
        const nextIndex = currentIndex < rows.length - 1 ? currentIndex + 1 : currentIndex
        setSelectedListing(rows[nextIndex].original.id)
      } else if (e.key === 'k') {
        // Move up
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0
        setSelectedListing(rows[prevIndex].original.id)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [table, selectedListingId, setSelectedListing])

  // Update row click handler
  const handleRowClick = (listing: HouseListing) => {
    setSelectedListing(listing.id === selectedListingId ? null : listing.id)
  }

  return (
    <div className="content-wrapper">
      <div className="table-section">
        <div className="glass-card">
          <table className="table-base">
            <thead className="sticky top-0 z-10 bg-[var(--surface-glass)]">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="table-header-row">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="table-header"
                      style={{ width: header.getSize() }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() && (
                          <span className="text-accent-blue">
                            {header.column.getIsSorted() === 'asc' ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            )}
                          </span>
                        )}
                      </div>
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`resize-handle ${
                            header.column.getIsResizing() 
                              ? 'resize-handle-active' 
                              : 'resize-handle-inactive'
                          }`}
                          onClick={e => e.stopPropagation()}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="table-body">
              {table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id}
                  onClick={() => handleRowClick(row.original)}
                  className={row.original.id === selectedListingId ? 'selected' : ''}
                  style={{ cursor: 'pointer' }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="table-cell"
                      style={{ 
                        width: cell.column.getSize(),
                        ...(cell.column.columnDef.meta?.getCellStyles?.(
                          cell.getValue(),
                          cell.getContext()
                        ) || {})
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {listings.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="table-empty">
                    No listings yet. Add your first property to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="map-section">
        <div className="glass-card">
          <Map />
        </div>
      </div>
      
      <div className="details-section">
        {selectedListingId ? (
          <div className="glass-card">
            <PropertyDetails 
              listing={listings.find(l => l.id === selectedListingId)!} 
            />
          </div>
        ) : (
          <div className="glass-card flex items-center justify-center text-gray-500">
            Select a property to view details
          </div>
        )}
      </div>
    </div>
  )
} 