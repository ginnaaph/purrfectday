import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type CoinsStore = {
  coins: number
  addCoins: (amount: number) => void
  spendCoins: (amount: number) => void
  setCoins: (amount: number) => void
  resetCoins: () => void
}

export const useCoinsStore = create<CoinsStore>()(
  persist(
    (set, get) => ({
      coins: 0,

      addCoins: (amount) => {
        set({ coins: get().coins + amount })
      },

      spendCoins: (amount) => {
        const current = get().coins
        if (current >= amount) {
          set({ coins: current - amount })
        }
      },

      setCoins: (amount) => {
        set({ coins: amount })
      },

      resetCoins: () => {
        set({ coins: 0 })
      }
    }),
    {
      name: 'coins-storage', // localStorage key
      storage: createJSONStorage(() => localStorage)
    }
  )
)
