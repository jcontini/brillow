'use client'

import { ButtonHTMLAttributes } from 'react'
import { FiMapPin } from 'react-icons/fi'

export function GeocodeAllButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  // ... existing component logic

  return (
    <button className={className} {...props}>
      <FiMapPin className="w-4 h-4" />
      <span>Geocode All</span>
    </button>
  )
} 