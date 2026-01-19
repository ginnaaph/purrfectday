import { BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/card/ui/card'
import type { JournalEntry } from '../../types'
import { getFormattedDateFromDate } from '@/utils/dates-time/getFormattedDate'

const mockEntries: JournalEntry[] = [
  {
    id: 1,
    title: null,
    content: 'Nothing',
    entry_date: new Date('2025-12-27'),
    category: null,
    mood: ':)',
    image: null,
    tags: [],
    files: []
  },
  {
    id: 2,
    title: null,
    content: "Hello, it's Thursday! I changed into my glasses because I was having a hard time seeing with contacts.",
    entry_date: new Date('2025-12-11'),
    category: null,
    mood: ':)',
    image: null,
    tags: [],
    files: []
  },
  {
    id: 3,
    title: null,
    content: 'Changed the RLS policy... so hoping that this works.',
    entry_date: new Date('2025-12-09'),
    category: null,
    mood: ':)',
    image: null,
    tags: [],
    files: []
  }
]

const formatEntryDate = (date: Date | null) => {
  if (!date) return 'No date'
  return getFormattedDateFromDate(date)
}

export const JournalPastEntriesPanel = ({ entries }: { entries: JournalEntry[] }) => {
  const displayEntries = entries.length ? entries : mockEntries

  return (
    <Card className="bg-white/90">
      <CardHeader className="bg-secondary-background/70 rounded-lg">
        <div className="text-center font-semibold text-primary-alt">Past Entries</div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayEntries.map((entry) => (
          <div key={entry.id} className="rounded-xl bg-white/70 p-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-primary-alt/80">
              <BookOpen className="size-4" />
              <span>
                {entry.mood ? `${entry.mood} ` : ''}
                {formatEntryDate(entry.entry_date)}
              </span>
            </div>
            <div className="mt-2 text-sm text-primary-alt/80">{entry.content}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
