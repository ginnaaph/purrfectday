export type GoalTask = {
  id: string
  title: string
  description?: string
  isDone: boolean
  taskId?: number | null
}

export type Goal = {
  id: number
  title: string
  description: string
  deadline?: string | null
  tasks: GoalTask[]
}

export type GoalTaskFormValues = {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high' | ''
  tags?: string
  estimatedPomodoros?: number | null
  dueDate?: string
  project: { label: string; value: number } | null
}
