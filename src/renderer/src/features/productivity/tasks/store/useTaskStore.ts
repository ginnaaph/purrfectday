import { create } from 'zustand'

// React Query owns tasks (Task[]) and server syncing.
// Zustand here stores ONLY UI/session state related to tasks.
// Do NOT put Task[] or perform any server updates in this store.

export type TaskUiState = {
  activeTaskId: number | null
  selectedTaskId: number | null
  lastCoinsEarned: number
  error: string | null
}

export type TaskUiActions = {
  setActiveTaskId: (id: number | null) => void
  setSelectedTaskId: (id: number | null) => void
  clearSelectedTask: () => void
  setLastCoinsEarned: (amount: number) => void
  clearLastCoinsEarned: () => void
  setError: (message: string | null) => void
  resetTaskUiState: () => void
}

export type TaskUiStore = TaskUiState & TaskUiActions

export const useTaskStore = create<TaskUiStore>((set) => ({
  activeTaskId: null,
  selectedTaskId: null,
  lastCoinsEarned: 0,
  error: null,

  setActiveTaskId: (id) => set({ activeTaskId: id }),
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  clearSelectedTask: () => set({ selectedTaskId: null }),

  setLastCoinsEarned: (amount) => set({ lastCoinsEarned: amount }),
  clearLastCoinsEarned: () => set({ lastCoinsEarned: 0 }),

  setError: (message) => set({ error: message }),

  resetTaskUiState: () =>
    set({ activeTaskId: null, selectedTaskId: null, lastCoinsEarned: 0, error: null })
}))

/*
Example usage:

// 1) Set selectedTaskId when clicking a task title to open details modal
import { useTaskStore } from '@/features/productivity/tasks/store/useTaskStore'

function TaskTitle({ taskId, title }: { taskId: number; title: string }) {
  const setSelectedTaskId = useTaskStore((s) => s.setSelectedTaskId)
  return (
    <button onClick={() => setSelectedTaskId(taskId)}>{title}</button>
  )
}

// 2) Set activeTaskId when focusing a task for Pomodoro
function FocusTaskButton({ taskId }: { taskId: number }) {
  const setActiveTaskId = useTaskStore((s) => s.setActiveTaskId)
  return (
    <button onClick={() => setActiveTaskId(taskId)}>Focus</button>
  )
}

// 3) Read lastCoinsEarned for a future CoinModal
function CoinFeedback() {
  const lastCoins = useTaskStore((s) => s.lastCoinsEarned)
  if (lastCoins > 0) {
    return <span>+{lastCoins} coins earned!</span>
  }
  return null
}
*/
