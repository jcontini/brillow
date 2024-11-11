'use client'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { FiChevronUp, FiChevronDown } from 'react-icons/fi'
import { HouseListing } from '@/types'
import { useListingsStore } from '@/stores/listingsStore'
import { columns } from './columns'
import { useState, useMemo, useEffect } from 'react'
import { PropertyDetails } from '../PropertyDetails'
import { StarRating } from '../StarRating'

export function ListingsTable() {
  const listings = useListingsStore((state) => state.listings)
  const updateListing = useListingsStore((state) => state.updateListing)
  const data = useMemo(() => listings, [listings])
  
  const [columnSizing, setColumnSizing] = useState({})
  const [selectedListing, setSelectedListing] = useState<HouseListing | null>(null)
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
      
      const currentIndex = selectedListing 
        ? rows.findIndex(row => row.original.id === selectedListing.id)
        : -1

      if (e.key === 'j') {
        // Move down
        const nextIndex = currentIndex < rows.length - 1 ? currentIndex + 1 : currentIndex
        setSelectedListing(rows[nextIndex].original)
      } else if (e.key === 'k') {
        // Move up
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0
        setSelectedListing(rows[prevIndex].original)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [table, selectedListing])

  return (
    <div className="main-content">
      <div className="table-container">
        <table className="table-base">
          <thead>
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
                onClick={() => setSelectedListing(row.original)}
                className={selectedListing?.id === row.original.id ? 'selected' : ''}
                style={{ cursor: 'pointer' }}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="table-cell"
                    style={{ 
                      width: cell.column.getSize(),
                      ...(cell.column.columnDef.meta?.getCellStyles?.(cell.getValue()) || {})
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
      
      <PropertyDetails listing={selectedListing} />
    </div>
  )
} 