import { useQuery } from '@tanstack/react-query'
import { fetchAllJournalEntries } from '../api/fetchAllJournalEntries.api'
import { JournalEntryComposer } from '../components/layout/JournalEntryComposer'
import { JournalHeader } from '../components/layout/JournalHeader'
import { JournalPastEntriesPanel } from '../components/layout/JournalPastEntriesPanel'
import { JournalStreakBar } from '../components/layout/JournalStreakBar'

export const JournalPg = () => {
  const query = useQuery({
    queryKey: ['journalEntries'],
    queryFn: fetchAllJournalEntries
  })
  const entries = query.data?.data ?? []
  return (
    <div className="bg-white p-6 min-h-full ml-4 rounded-xl overflow-hidden flex flex-col gap-4">
      <JournalHeader />
      <JournalStreakBar />
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <JournalEntryComposer />
        <JournalPastEntriesPanel entries={entries} />
      </div>
    </div>
  )
}
