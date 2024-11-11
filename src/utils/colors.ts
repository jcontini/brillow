export const getRatingColor = (rating: number): string => {
  const colors = {
    1: '#ef4444', // Red
    2: '#f97316', // Orange
    3: '#eab308', // Yellow
    4: '#22c55e', // Green
    5: '#10b981'  // Emerald
  }
  
  return colors[rating as keyof typeof colors] || colors[3]
}

export const getEmptyStarColor = () => 'rgba(255, 255, 255, 0.2)' 