'use client'

import { useState, useRef } from 'react'
import { useTerminalStore } from '@/stores/terminalStore'

export const Terminal = () => {
  const { logs, clearLogs } = useTerminalStore()
  const [height, setHeight] = useState(200)
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startHeight = useRef(0)

  const handleMouseDown = (e: React.MouseDown) => {
    isDragging.current = true
    startY.current = e.clientY
    startHeight.current = height
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return
    const delta = startY.current - e.clientY
    const newHeight = Math.max(100, Math.min(800, startHeight.current + delta))
    setHeight(newHeight)
  }

  const handleMouseUp = () => {
    isDragging.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  return (
    <div 
      className="terminal-container"
      style={{ height: height }}
    >
      <div className="terminal-header">
        <span className="font-mono text-sm opacity-70">Debug Terminal</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => clearLogs()}
            className="text-xs opacity-50 hover:opacity-100"
          >
            Clear
          </button>
          <div 
            className="terminal-drag-handle"
            onMouseDown={handleMouseDown}
          />
        </div>
      </div>
      <div 
        className="terminal-content"
        style={{ height: `calc(${height}px - 37px)` }}
      >
        {logs.length === 0 ? (
          <div className="text-sm opacity-50 italic">No logs yet...</div>
        ) : (
          logs.map(log => (
            <div 
              key={log.id}
              className={`terminal-entry ${log.type}`}
            >
              <span className="timestamp">
                {log.timestamp.toLocaleTimeString()}
              </span>
              <span className="message">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 