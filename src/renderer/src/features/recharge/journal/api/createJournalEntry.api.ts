import { supabase } from '@/libs/supabaseClient'
import { JournalEntry } from '@/features/recharge/journal/types'

export const createJournalEntry = async (
  entry: Partial<JournalEntry>
): Promise<{ data: JournalEntry[] | null; error: Error | null }> => {
  const { data, error } = await supabase.from('journal_entries').insert([entry])
  console.log(data, error)
  return { data, error }
}
