import { create } from 'zustand'
import type { LogType, LogMessage, TerminalState } from '@/types'

export const useTerminalStore = create<TerminalState>((set) => ({
  messages: [],
  addLog: (text, type) => set((state) => ({
    messages: [...state.messages, {
      text,
      type,
      timestamp: Date.now()
    }]
  })),
  clear: () => set({ messages: [] })
})) 