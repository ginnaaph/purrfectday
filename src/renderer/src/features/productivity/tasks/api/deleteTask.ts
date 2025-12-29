import { supabase } from '@/libs/supabaseClient'
import { Task } from '@/features/productivity/tasks/types'

export const deleteTask = async (
  taskId: number
): Promise<{ data: Task[] | null; error: Error | null }> => {
  const { data, error } = await supabase.from('tasks').delete().eq('id', taskId)

  return { data, error }
}
