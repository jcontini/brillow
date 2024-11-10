import { AppState, HouseListing } from '@/types'

export function validateImportData(jsonData: any): AppState {
  // Basic validation
  if (!jsonData?.data?.listings || !Array.isArray(jsonData.data.listings)) {
    throw new Error('Invalid import file format')
  }

  // Validate each listing has required fields
  jsonData.data.listings.forEach((listing: any, index: number) => {
    if (!listing.id) {
      // Add IDs if missing
      listing.id = `imported-${index}`
    }
  })

  return jsonData as AppState
}

export function createExportData(listings: HouseListing[]): AppState {
  return {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    settings: {
      columnOrder: [
        "rating",
        "address",
        "neighborhood",
        "bedrooms",
        "bathrooms",
        "price",
        "squareFeet",
        "availability",
        "notes",
        "dateAdded"
      ],
      currency: "USD"
    },
    data: {
      listings
    }
  }
}

export function downloadJson(data: any, filename: string) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
} 