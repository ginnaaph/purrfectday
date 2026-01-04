import type { Project } from '@/features/productivity/tasks/types'
import { supabase } from '@/libs/supabaseClient'

export const updateProject = async (
  id: number,
  updates: Partial<Project>
): Promise<{ data: Project[] | null; error: Error | null }> => {
  return await supabase.from('projects').update(updates).eq('id', id).select()
}

// Backwards-compatible alias
export const updateList = updateProject
