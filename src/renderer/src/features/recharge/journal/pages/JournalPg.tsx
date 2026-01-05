import Quotes from '../components/Quotes'
import { PastEntries } from '../components/PastEntries'
import { fetchAllJournalEntries } from '../api/fetchAllJournalEntries.api'
import { useQuery } from '@tanstack/react-query'

export const JournalPg = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const query = useQuery({
    queryKey: ['journalEntries'],
    queryFn: fetchAllJournalEntries
  })
  const entries = query.data?.data ?? []
  return (
    <div className="w-full overflow-hidden flex-col flex">
      <h1 className=" text-center tracking-wider mb-2 text-brown">Journal</h1> <Quotes />
      <div>
        <PastEntries entries={entries} />
      </div>
    </div>
  )
}
