import { supabase } from '@/libs/supabaseClient'
import type { Project } from '@/features/productivity/tasks/types'

export const insertProject = async (name: string): Promise<Project | null> => {
  const { data, error } = await supabase.from('projects').insert([{ name }]).select().single()

  if (error) {
    console.error('Error inserting project:', error)
    return null
  }

  return data
}

// Backwards-compatible alias
export const insertList = insertProject
