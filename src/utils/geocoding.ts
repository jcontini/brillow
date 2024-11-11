export async function geocodeAddress(address: string) {
  if (!address) return null
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?` + 
      new URLSearchParams({
        access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
        limit: '1',
        types: 'address'
      })
    )
    
    if (!response.ok) throw new Error('Geocoding failed')
    
    const data = await response.json()
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].geometry.coordinates
      return { lng, lat }
    }
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
} 