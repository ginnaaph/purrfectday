import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { CalendarDays, Image, Link2, Paperclip } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/card/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/text-area/ui/textArea'
import { createJournalEntry } from '@/features/recharge/journal/api/createJournalEntry.api'
import { queryClient } from '@/libs/QueryClient'
import type { JournalEntry, Moods } from '@/features/recharge/journal/types'

const moodOptions: Array<{ label: string; value: Moods }> = [
  {
    label: String.fromCodePoint(0x1f642),
    value: String.fromCodePoint(0x1f642) as Moods
  },
  {
    label: String.fromCodePoint(0x1f610),
    value: String.fromCodePoint(0x1f610) as Moods
  },
  {
    label: String.fromCodePoint(0x1f641),
    value: String.fromCodePoint(0x1f641) as Moods
  }
]

export const JournalEntryComposer = () => {
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<Moods | null>(null)
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
  const mutation = useMutation({
    mutationFn: (entry: Partial<JournalEntry>) => createJournalEntry(entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] })
    }
  })

  const handleSave = () => {
    const trimmedContent = content.trim()
    if (!trimmedContent) return

    const entryToSave: Partial<JournalEntry> = {
      content: trimmedContent,
      entry_date: new Date(),
      mood
    }

    mutation.mutate(entryToSave, {
      onSuccess: () => {
        setContent('')
        setMood(null)
      },
      onError: (error) => {
        console.error('Journal entry creation failed:', error)
      }
    })
  }

  const isSaveDisabled = mutation.isPending || content.trim().length === 0

  return (
    <Card className="bg-background">
      <CardHeader className="bg-secondary-alt rounded-lg">
        <div className="flex items-center gap-2 text-white">
          <CalendarDays className="size-4" />
          <span className="font-semibold">{todayLabel}</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-xl bg-secondary px-4 py-3">
          <div className="text-sm text-white *:font-semibold">How are you feeling today?</div>
          <div className="mt-2 flex items-center gap-3 text-sm">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                className={`rounded-full bg-white px-3 py-1 shadow-sm ${mood === option.value ? 'ring-2 ring-white/70' : ''}`}
                onClick={() => setMood(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          placeholder="What's on your mind today?"
          rows={12}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />

        <div className="flex flex-wrap items-center gap-3 text-primary-alt/70">
          <button className="flex items-center gap-2 rounded-full bg-secondary-background/70 px-3 py-1 text-xs font-semibold">
            <Paperclip className="size-4" />
            Attach
          </button>
          <button className="flex items-center gap-2 rounded-full bg-secondary-background/70 px-3 py-1 text-xs font-semibold">
            <Image className="size-4" />
            Media
          </button>
          <button className="flex items-center gap-2 rounded-full bg-secondary-background/70 px-3 py-1 text-xs font-semibold">
            <Link2 className="size-4" />
            Link
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Random Prompt
            </Button>
            <Button variant="outline" size="sm">
              Browse Prompts
            </Button>
          </div>
          <Button size="sm" onClick={handleSave} disabled={isSaveDisabled}>
            {mutation.isPending ? 'Saving...' : 'Save Entry'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
