import { supabase } from '@/libs/supabaseClient'
import { Task } from '@/features/productivity/tasks/types'
import { toDateOnlyString } from '@/utils/dates-time/dateHelperFn'

export const createTask = async (
  task: Partial<Task>
): Promise<{ data: Task[] | null; error: Error | null }> => {
  const payload: any = { ...task }
  if ('dueDate' in payload) {
    const raw = payload.dueDate
    payload.due_date =
      raw == null
        ? null
        : raw instanceof Date
          ? toDateOnlyString(raw)
          : typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw)
            ? raw
            : toDateOnlyString(new Date(raw))
    delete payload.dueDate
  }
  const { data, error } = await supabase.from('tasks').insert([payload])
  return { data, error }
}
