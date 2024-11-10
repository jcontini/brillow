'use client'

import { useListingsStore } from '@/stores/listingsStore'
import { validateImportData } from '@/utils/importExport'
import { FiUpload } from 'react-icons/fi'

export function ImportButton() {
  const importListings = useListingsStore((state) => state.importListings)

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const json = JSON.parse(text)
      const validData = validateImportData(json)
      importListings(validData.data.listings)
    } catch (error) {
      console.error('Import failed:', error)
    }
  }

  return (
    <label className="action-button">
      <FiUpload className="w-4 h-4" />
      <span>Import Listings</span>
      <input
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </label>
  )
} 