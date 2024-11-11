'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTerminalStore } from '@/stores/terminalStore'
import type { LogType } from '@/types'

export function Terminal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const messages = useTerminalStore((state) => state.messages)
  const clearTerminal = useTerminalStore((state) => state.clear)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  const getMessageClass = (type: LogType) => {
    switch (type) {
      case 'error':
        return 'text-red-500'
      case 'success':
        return 'text-green-500'
      case 'info':
      default:
        return 'text-[var(--text-secondary)]'
    }
  }

  return createPortal(
    <div
      className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-[var(--surface-glass)] border-t border-[var(--border-color)] backdrop-blur-md">
        <div className="container mx-auto p-2">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-[var(--text-secondary)]">Debug Terminal</div>
            <div className="flex gap-2">
              <button
                onClick={clearTerminal}
                className="px-2 py-1 text-xs hover:bg-[var(--surface-hover)] rounded"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-2 py-1 text-xs hover:bg-[var(--surface-hover)] rounded"
              >
                Close (Esc)
              </button>
            </div>
          </div>
          <div className="bg-[var(--surface)] rounded overflow-auto h-[200px]">
            <div className="p-2 font-mono text-sm">
              {messages.map((message, i) => (
                <div 
                  key={i} 
                  className={`whitespace-pre-wrap ${getMessageClass(message.type)}`}
                >
                  {message.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
} 