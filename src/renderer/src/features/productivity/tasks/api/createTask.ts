import { supabase } from '@/libs/supabaseClient'
import { Task } from '@/features/productivity/tasks/types'

export const createTask = async (
  task: Partial<Task>
): Promise<{ data: Task[] | null; error: Error | null }> => {
  const { data, error } = await supabase.from('tasks').insert([task])
  return { data, error }
}
