import { create } from 'zustand'

type TaskModalStore = {
  isOpen: boolean
  selectedTaskId: number | null
  open: (taskId: number) => void
  close: () => void
}

export const useTaskModalStore = create<TaskModalStore>((set) => ({
  isOpen: false,
  selectedTaskId: null,
  open: (taskId) => {
    console.log('[TaskModalStore] open called with taskId:', taskId)
    set({ isOpen: true, selectedTaskId: taskId })
  },
  close: () => set({ isOpen: false, selectedTaskId: null }),
}))
