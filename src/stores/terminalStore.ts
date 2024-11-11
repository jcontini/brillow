import { create } from 'zustand'

type LogType = 'info' | 'error' | 'success'

interface LogEntry {
  id: number
  timestamp: Date
  message: string
  type: LogType
}

interface TerminalStore {
  logs: LogEntry[]
  addLog: (message: string, type?: LogType) => void
  clearLogs: () => void
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  logs: [],
  addLog: (message, type = 'info') => set((state) => ({
    logs: [...state.logs, {
      id: Date.now(),
      timestamp: new Date(),
      message,
      type
    }]
  })),
  clearLogs: () => set({ logs: [] })
})) 