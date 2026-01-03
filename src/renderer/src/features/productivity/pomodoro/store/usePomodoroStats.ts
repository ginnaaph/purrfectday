import { create } from 'zustand'
import mockPomodoroEvents from '../../../productivity/data/mock/mockPomodoroEvents'

// runtime dev check (Vite provides import.meta.env.DEV)
const isDev = (() => {
  try {
    // @ts-ignore - import.meta typing may not be present in tests
    if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) return true
  } catch (e) {
    /* ignore */
  }
  return process.env.NODE_ENV === 'development'
})()

// Local type to avoid module resolution issues
type PomodoroEvent = {
  id: number
  phase: 'focus' | 'break'
  startedAt: Date
  endedAt: Date
  durationSec: number
  completed: boolean
  taskId?: number | null
}

type PomodoroStatsStore = {
  events: PomodoroEvent[]
  addEvent: (e: PomodoroEvent) => void
  clearEvents: () => void
}

export const usePomodoroStatsStore = create<PomodoroStatsStore>((set) => ({
  events: isDev ? mockPomodoroEvents : [],
  addEvent: (e) =>
    set((state) => ({
      events: [...state.events, e] // append new event
    })),
  clearEvents: () =>
    set(() => ({
      events: []
    }))
}))
