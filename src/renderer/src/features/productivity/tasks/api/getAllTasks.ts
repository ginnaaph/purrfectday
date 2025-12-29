import { supabase } from '@/libs/supabaseClient'
import { Task } from '@/features/productivity/tasks/types'

export const getAllTasks = async (): Promise<{ data: Task[] | null; error: Error | null }> => {
  const { data, error } = await supabase.from('tasks').select('*')
  console.log(data, error)
  const mappedData =
    data?.map((task) => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      dueDate: task.due_date ? new Date(task.due_date) : null,
      isComplete: task.is_complete ?? false,
      earnedCoins: task.earned_coins ?? 0,
      estimatedPomodoros: task.estimated_pomodoros ?? 0,
      pomodorosCompleted: task.pomodoros_completed ?? 0,
      completedAt: task.completed_at ? new Date(task.completed_at) : null,
      // Support legacy `list_id` column: prefer `project_id`, fall back to `list_id`.
      project_id: task.project_id ?? task.list_id ?? null,
    })) ?? []

  return { data: mappedData, error }
}
