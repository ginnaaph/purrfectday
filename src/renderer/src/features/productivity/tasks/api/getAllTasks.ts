import { supabase } from '@/libs/supabaseClient'
import { parseDateOnly } from '@/utils/dates-time/dateHelperFn'
import { Task } from '@/features/productivity/tasks/types'

export const getAllTasks = async (): Promise<{ data: Task[] | null; error: Error | null }> => {
  const { data, error } = await supabase.from('tasks').select('*')
  console.log(data, error)
  const mappedData =
    data?.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description ?? undefined,
      priority: task.priority,
      dueDate: parseDateOnly(task.due_date),
      isComplete: task.is_complete ?? false,
      earnedCoins: task.earned_coins ?? 0,
      estimatedPomodoros: task.estimated_pomodoros ?? 0,
      pomodorosCompleted: task.pomodoros_completed ?? 0,
      completedAt: task.completed_at ? new Date(task.completed_at) : null,
      // Support legacy `list_id` column: prefer `project_id`, fall back to `list_id`.
      project_id: task.project_id ?? task.list_id ?? null,
      tags: task.tags ?? [],
      type: task.type ?? null,
      scheduleDays: task.schedule_days ?? null,
      timeOfDay: task.time_of_day ?? null
    })) ?? []

  return { data: mappedData, error }
}
