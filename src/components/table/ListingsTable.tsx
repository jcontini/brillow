'use client'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { HouseListing } from '@/types'
import { useListingsStore } from '@/stores/listingsStore'
import { columns } from './columns'
import { useState, useMemo } from 'react'

export function ListingsTable() {
  const listings = useListingsStore((state) => state.listings)
  const data = useMemo(() => listings, [listings])
  
  const [columnSizing, setColumnSizing] = useState({})
  
  const table = useReactTable<HouseListing>({
    data,
    columns: columns as ColumnDef<HouseListing, any>[],
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 50,
      maxSize: 500,
      size: 150,
    },
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    state: {
      columnSizing,
    },
    onColumnSizingChange: setColumnSizing,
  })

  return (
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
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`resize-handle ${
                        header.column.getIsResizing() 
                          ? 'resize-handle-active' 
                          : 'resize-handle-inactive'
                      }`}
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="table-body">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="table-row">
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="table-cell"
                  style={{ width: cell.column.getSize() }}
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
  )
} 