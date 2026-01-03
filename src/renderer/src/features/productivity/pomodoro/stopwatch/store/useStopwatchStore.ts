import { create } from 'zustand'

type StopwatchStore = {
  isRunning: boolean
  elapsedTime: number
  start: () => void
  pause: () => void
  reset: () => void
  tick: () => void
}

const useStopwatchStore = create<StopwatchStore>((set) => ({
  isRunning: false,
  elapsedTime: 0,

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  reset: () => set({ elapsedTime: 0, isRunning: false }),
  tick: () =>
    set((state) => ({
      elapsedTime: state.elapsedTime + 1
    }))
}))
export default useStopwatchStore
