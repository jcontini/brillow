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