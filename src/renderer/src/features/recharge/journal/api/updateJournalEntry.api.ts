import { JournalEntry } from '../types'
import { supabase } from '@/libs/supabaseClient'

export const updateJournalEntry = async (
  id: number,
  updatedEntry: Partial<JournalEntry>
): Promise<{ data: JournalEntry[] | null; error: Error | null }> => {
  const { data, error } = await supabase.from('journal_entries').update(updatedEntry).eq('id', id)
  return { data, error }
}
