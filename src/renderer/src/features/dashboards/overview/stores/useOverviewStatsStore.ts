import { create } from 'zustand'
import type { OverviewEvent } from '../types'
import mockOverviewEvents from '../data/mockOverviewEvents'

const isDev = process.env.NODE_ENV === 'development'

type OverviewStatsStore = {
  events: OverviewEvent[]
  addEvent: (event: OverviewEvent) => void
  clearEvents: () => void
}

export const useOverviewStatsStore = create<OverviewStatsStore>((set) => ({
  events: isDev ? mockOverviewEvents : [],
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event]
    })),
  clearEvents: () => set({ events: [] })
}))
