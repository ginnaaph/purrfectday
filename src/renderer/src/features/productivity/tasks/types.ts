export type Task = {
  id: number
  title: string
  description?: string
  dueDate?: Date | null
  project_id?: number | null
  priority?: 'high' | 'medium' | 'low' | null
  estimatedPomodoros?: number | null
  pomodorosCompleted?: number | null
  isComplete: boolean
  completedAt?: Date | null
  tags?: string[]
  earnedCoins?: number
}

export interface TaskApiUpdateInput {
  title?: string
  description?: string
  dueDate?: Date | null
  priority?: 'high' | 'medium' | 'low' | null
  tags?: string // API expects comma-separated string from the form
  project_id?: number | null
  is_complete: boolean
  completed_at?: Date | null
  estimated_pomodoros?: number | null
  earnedCoins?: number | null
}

export type Project = {
  id: number
  name: string
  icon?: string
}
