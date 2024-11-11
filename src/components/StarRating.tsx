"use client"

import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { getRatingColor, getEmptyStarColor } from '@/utils/colors'

interface StarRatingProps {
  rating?: number
  onChange?: (rating: number) => void
  colorMode?: 'gradient'
}

export function StarRating({ rating = 0, onChange, colorMode }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  
  const getStarColor = (starPosition: number, currentRating: number) => {
    if (!currentRating || starPosition > currentRating) {
      return getEmptyStarColor()
    }
    return colorMode === 'gradient' 
      ? getRatingColor(currentRating)
      : '#eab308' // Default yellow for non-gradient mode
  }
  
  return (
    <div className="star-rating flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(null)}
          className={`star-button ${!onChange ? 'readonly' : ''}`}
          style={{
            color: getStarColor(star, hoverRating || rating),
            transition: 'color 150ms ease-in-out'
          }}
        >
          <FaStar className="w-4 h-4" />
        </button>
      ))}
    </div>
  )
} 