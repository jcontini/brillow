"use client"

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { BsMenuButtonWide } from 'react-icons/bs'
import { FiMapPin, FiDownload, FiUpload } from 'react-icons/fi'

export function ActionsMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="button">
          <BsMenuButtonWide className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          className="actions-menu-content" 
          sideOffset={5}
          align="end"
        >
          <DropdownMenu.Item className="actions-menu-item">
            <button className="w-full flex items-center gap-2">
              <FiMapPin className="w-4 h-4" />
              <span>Geocode All</span>
            </button>
          </DropdownMenu.Item>
          
          <DropdownMenu.Separator className="actions-menu-separator" />
          
          <DropdownMenu.Item className="actions-menu-item">
            <button className="w-full flex items-center gap-2">
              <FiUpload className="w-4 h-4" />
              <span>Import Listings</span>
            </button>
          </DropdownMenu.Item>
          
          <DropdownMenu.Item className="actions-menu-item">
            <button className="w-full flex items-center gap-2">
              <FiDownload className="w-4 h-4" />
              <span>Export Listings</span>
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
} 