import { JournalEntry } from '../types'
import type { Moods } from '../types'

import { supabase } from '@/libs/supabaseClient'

export const fetchAllJournalEntries = async (): Promise<{
  data: JournalEntry[]
  error: Error | null
}> => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('entry_date', { ascending: false })

  const isMood = (m: unknown): m is Moods => m === '🙂' || m === '😐' || m === '🙁'

  const mappedData =
    data?.map((entry) => ({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      entry_date: entry.entry_date ? new Date(entry.entry_date) : null,
      category: entry.category,
      mood: isMood(entry.mood) ? entry.mood : null,
      image: entry.image || null,
      tags: entry.tags || [],
      files: entry.files || null,
    })) ?? []

  return { data: mappedData, error }
}
