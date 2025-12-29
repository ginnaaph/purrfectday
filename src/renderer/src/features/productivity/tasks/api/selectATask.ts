import { supabase } from '@/libs/supabaseClient'
import { Task } from '@/features/productivity/tasks/types'

export const selectATask = async (taskId: number): Promise<Task | null> => {
  const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).maybeSingle()

  if (!data) return null

  const mapped: Task = {
    id: data.id,
    title: data.title,
    description: data.description,
    dueDate: data.due_date ? new Date(data.due_date) : null,
    // Support legacy `list_id` column: prefer `project_id`, fall back to `list_id`.
    project_id: data.project_id ?? data.list_id ?? null,
    priority: data.priority ?? null,
    estimatedPomodoros: data.estimated_pomodoros ?? 0,
    pomodorosCompleted: data.pomodoros_completed ?? 0,
    isComplete: data.is_complete ?? false,
    completedAt: data.completed_at ? new Date(data.completed_at) : null,
    tags: data.tags ?? [],
    earnedCoins: data.earned_coins ?? 0
  }

  return mapped
}
