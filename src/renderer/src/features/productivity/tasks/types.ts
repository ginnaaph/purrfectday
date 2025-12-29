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
