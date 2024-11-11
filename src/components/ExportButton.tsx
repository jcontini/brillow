"use client"

import { ButtonHTMLAttributes } from 'react'
import { FiDownload } from 'react-icons/fi'

export function ExportButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  // ... existing component logic

  return (
    <button className={className} {...props}>
      <FiDownload className="w-4 h-4" />
      <span>Export Listings</span>
    </button>
  )
} 