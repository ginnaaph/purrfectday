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
}
