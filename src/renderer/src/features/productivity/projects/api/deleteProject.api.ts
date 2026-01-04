import type { Project } from '@/features/productivity/tasks/types'
import { supabase } from '@/libs/supabaseClient'
export const deleteList = async (
  projectId: number
): Promise<{ data: Project[] | null; error: Error | null }> => {
  const { data, error } = await supabase.from('projects').delete().eq('id', projectId)

  return { data, error }
}

// Backwards-compatible alias
export const deleteProject = deleteList