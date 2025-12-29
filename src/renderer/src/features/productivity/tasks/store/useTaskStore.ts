import { create } from 'zustand'

export type TaskUIStore = {
  // UI/session state (NOT server data)
  activeTaskId: number | null
  selectedTaskId: number | null

  // UI feedback (ex: CoinModal)
  earnedCoins: number
  error: string | null

  // Actions
  setActiveTaskId: (id: number | null) => void
  setSelectedTaskId: (id: number | null) => void
  setEarnedCoins: (amount: number) => void
  clearEarnedCoins: () => void
  setError: (message: string | null) => void
}

export const useTaskStore = create<TaskUIStore>((set) => ({
  activeTaskId: null,
  selectedTaskId: null,
  earnedCoins: 0,
  error: null,

  setActiveTaskId: (id) => set({ activeTaskId: id }),
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),

  setEarnedCoins: (amount) => set({ earnedCoins: amount }),
  clearEarnedCoins: () => set({ earnedCoins: 0 }),

  setError: (message) => set({ error: message }),
}))
