import { JournalEntry } from '../types'
import { supabase } from '@/libs/supabaseClient'

export const fetchAllJournalEntries = async (): Promise<{
  data: JournalEntry[] | null
  error: Error | null
}> => {
  const { data, error } = await supabase.from('journal_entries').select('*')

  const mappedData =
    data?.map((entry) => ({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      entry_date: entry.entry_date ? new Date(entry.entry_date) : null,
      category: entry.category,
      mood: entry.mood ? entry.mood : null,
      image: entry.image,
      tags: entry.tags || [],
      files: entry.files || null,
    })) ?? []

  return { data: mappedData, error }
}
