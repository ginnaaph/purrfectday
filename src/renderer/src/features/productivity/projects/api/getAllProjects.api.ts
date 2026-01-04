import  type { Project } from '@/features/productivity/tasks/types'
import { supabase } from '@/libs/supabaseClient'

export const getAllProjects = async (): Promise<Project[] | null> => {
  const { data, error } = await supabase.from('projects').select()

  if (error) {
    console.error('Failed to fetch projects:', error)
    return null
  }

  return data
}

// Backwards-compatible alias for older imports
export const getAllLists = getAllProjects
