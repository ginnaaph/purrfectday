import { supabase } from '@/libs/supabaseClient'
import { JournalEntry } from '@/features/recharge/journal/types'

export const createJournalEntry = async (
  entry: Partial<JournalEntry>
): Promise<{ data: JournalEntry[] | null; error: Error | null }> => {
  const payload: Partial<JournalEntry> & { entry_date?: string | null } = { ...entry }
  if ('entry_date' in payload) {
    payload.entry_date =
      payload.entry_date instanceof Date
        ? payload.entry_date.toISOString()
        : payload.entry_date ?? null
  }
  const { data, error } = await supabase.from('journal_entries').insert([payload])
  return { data, error }
}
