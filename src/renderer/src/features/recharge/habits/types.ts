export type HabitLogStatus = 'completed' | 'missed'

export type HabitLog = {
  id: string
  task_id: number
  log_date: string
  status: HabitLogStatus
  notes?: string | null
  completed_at?: Date | null
  created_at?: Date | null
}

export type HabitTaskInput = {
  title: string
  description?: string
  scheduleDays?: number[] | null
  timeOfDay?: 'morning' | 'afternoon' | 'night' | null
}
