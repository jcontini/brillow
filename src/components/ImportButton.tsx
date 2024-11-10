'use client'

import { useListingsStore } from '@/stores/listingsStore'
import { validateImportData } from '@/utils/importExport'

export function ImportButton() {
  const importListings = useListingsStore(state => state.importListings)

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const jsonData = JSON.parse(text)
      const validatedData = validateImportData(jsonData)
      
      importListings(validatedData.data.listings)
      
      // Reset the input
      event.target.value = ''
    } catch (error) {
      console.error('Import failed:', error)
      // TODO: Add toast notification for error
    }
  }

  return (
    <div className="relative">
      <input
        type="file"
        accept=".json"
        onChange={handleImport}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <button className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors">
        Import Listings
      </button>
    </div>
  )
} 