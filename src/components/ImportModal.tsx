"use client"

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (mode: 'overwrite' | 'append') => void
  fileName: string
}

export function ImportModal({ isOpen, onClose, onConfirm, fileName }: ImportModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">Import Options</h3>
        <p className="modal-description">
          Importing: {fileName}
        </p>
        <div className="modal-buttons">
          <button 
            className="action-button"
            onClick={() => onConfirm('overwrite')}
          >
            Overwrite Existing
          </button>
          <button 
            className="action-button"
            onClick={() => onConfirm('append')}
          >
            Append New
          </button>
          <button 
            className="action-button secondary"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
} 