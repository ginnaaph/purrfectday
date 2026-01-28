import { supabase } from '@/libs/supabaseClient'
import type { Task } from '@/features/productivity/tasks/types'

const normalizeScheduleDays = (value: unknown): number[] | null => {
  if (!Array.isArray(value)) return null
  const normalized = value
    .map((day) => (typeof day === 'string' ? Number(day) : day))
    .filter((day) => Number.isFinite(day)) as number[]
  return normalized.length ? normalized : null
}

const mapHabitTask = (record: any): Task => ({
  id: record.id,
  title: record.title,
  description: record.description ?? undefined,
  dueDate: record.due_date ? new Date(record.due_date) : null,
  project_id: record.project_id ?? record.list_id ?? null,
  priority: record.priority ?? null,
  estimatedPomodoros: record.estimated_pomodoros ?? 0,
  pomodorosCompleted: record.pomodoros_completed ?? 0,
  isComplete: record.is_complete ?? false,
  completedAt: record.completed_at ? new Date(record.completed_at) : null,
  tags: record.tags ?? [],
  earnedCoins: record.earned_coins ?? 0,
  type: record.type ?? null,
  scheduleDays: normalizeScheduleDays(record.schedule_days),
  timeOfDay: record.time_of_day ?? null
})

export const getHabitTasks = async (): Promise<{ data: Task[] | null; error: Error | null }> => {
  const { data, error } = await supabase.from('tasks').select('*').eq('type', 'habit')
  const mapped = data ? data.map(mapHabitTask) : null
  return { data: mapped, error }
}
