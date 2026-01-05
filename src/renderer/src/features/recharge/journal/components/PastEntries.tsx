import { BookOpen } from 'lucide-react'
import type { JournalEntry } from '../types'
import { getFormattedDateFromDate } from '@/utils/dates-time/getFormattedDate'
import { Card, CardContent, CardHeader } from '@/components/card/ui/card'

interface PastEntriesProps {
  entries: JournalEntry[]
}

export const PastEntries = ({ entries }: PastEntriesProps) => {
  return (
    <Card>
      <CardHeader> Past Entries </CardHeader>
      <CardContent>
        {entries.map((entry) => (
          <div key={entry.id} className="mb-4 last:mb-0">
            <div className="flex items-center mb-2 text-sm text-secondary">
              <BookOpen className="size-4 mr-2" />
              <span> {getFormattedDateFromDate(new Date(entry.entry_date || ''))}</span>
            </div>
            <div className="whitespace-pre-wrap text-base text-primary">{entry.content}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
