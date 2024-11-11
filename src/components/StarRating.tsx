"use client"

import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

interface StarRatingProps {
  rating: number
  onChange?: (rating: number) => void
  colorMode?: 'gradient'
}

const getStarColor = (starPosition: number, rating: number) => {
  if (starPosition > rating) return 'rgba(255, 255, 255, 0.2)' // Unfilled stars
  
  // Color gradient from red (1) to green (5)
  const colors = {
    1: '#ef4444', // Red
    2: '#f97316', // Orange
    3: '#eab308', // Yellow
    4: '#22c55e', // Green
    5: '#10b981'  // Emerald
  }
  
  return colors[rating as keyof typeof colors] || colors[3]
}

export function StarRating({ rating, onChange, colorMode }: StarRatingProps) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange?.(star)}
          className={`star-button ${star <= rating ? 'filled' : ''} ${!onChange ? 'readonly' : ''}`}
          style={colorMode === 'gradient' ? {
            color: getStarColor(star, rating)
          } : undefined}
        >
          <FaStar />
        </button>
      ))}
    </div>
  )
} 