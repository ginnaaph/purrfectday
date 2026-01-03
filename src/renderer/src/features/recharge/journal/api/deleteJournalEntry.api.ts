import { JournalEntry } from '../types'
import { supabase } from '@/libs/supabaseClient'

export const deleteJournalEntry = async (
  id: number
): Promise<{ data: JournalEntry[] | null; error: Error | null }> => {
  const { data, error } = await supabase.from('journal_entries').delete().eq('id', id)
  return { data, error }
}
