import { supabase } from '@/libs/supabaseClient'
import { Task } from '@/features/productivity/tasks/types'

export const createTask = async (
  task: Partial<Task>
): Promise<{ data: Task[] | null; error: Error | null }> => {
  const payload: any = { ...task }
  if ('dueDate' in payload) {
    payload.due_date = payload.dueDate
      ? (payload.dueDate instanceof Date
          ? payload.dueDate
          : new Date(payload.dueDate)
        ).toISOString()
      : null
    delete payload.dueDate
  }
  const { data, error } = await supabase.from('tasks').insert([payload])
  return { data, error }
}
