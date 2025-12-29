import { create } from 'zustand'

type FocusTaskStore = {
  focusedTaskId: number | null
  setFocusedTaskId: (taskId: number) => void
  clearFocusedTask: () => void
}

export const useFocusTaskStore = create<FocusTaskStore>((set) => ({
  focusedTaskId: null,
  setFocusedTaskId: (taskId) => set({ focusedTaskId: taskId }),
  clearFocusedTask: () => set({ focusedTaskId: null }),
}))
