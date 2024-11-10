"use client"

import { useListingsStore } from "@/stores/listingsStore"
import { createExportData, downloadJson } from "@/utils/importExport"
import { FiDownload } from "react-icons/fi"

export function ExportButton() {
  const listings = useListingsStore((state) => state.listings)
  
  const handleExport = () => {
    const exportData = createExportData(listings)
    const filename = `brillow_export_${new Date().toISOString().split('T')[0]}.json`
    downloadJson(exportData, filename)
  }

  return (
    <button
      onClick={handleExport}
      className="action-button"
    >
      <FiDownload className="w-4 h-4" />
      <span>Export Listings</span>
    </button>
  )
} 