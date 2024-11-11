'use client'

import { useListingsStore } from '@/stores/listingsStore'
import { validateImportData } from '@/utils/importExport'
import { FiUpload } from 'react-icons/fi'
import { useState, useRef } from 'react'
import { ImportModal } from './ImportModal'

export function ImportButton() {
  const importListings = useListingsStore((state) => state.importListings)
  const appendListings = useListingsStore((state) => state.appendListings)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPendingFile(file)
      setIsModalOpen(true)
    }
  }

  const handleImport = async (mode: 'overwrite' | 'append') => {
    if (!pendingFile) return

    try {
      const text = await pendingFile.text()
      const json = JSON.parse(text)
      const validData = validateImportData(json)
      
      if (mode === 'overwrite') {
        importListings(validData.data.listings)
      } else {
        appendListings(validData.data.listings)
      }

      setIsModalOpen(false)
      setPendingFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Import failed:', error)
      setIsModalOpen(false)
      setPendingFile(null)
    }
  }

  return (
    <>
      <label className="action-button">
        <FiUpload className="w-4 h-4" />
        <span>Import Listings</span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </label>

      <ImportModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setPendingFile(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        }}
        onConfirm={handleImport}
        fileName={pendingFile?.name || ''}
      />
    </>
  )
} 