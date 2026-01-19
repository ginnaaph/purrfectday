import { CalendarDays, Image, Link2, Paperclip } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/card/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/text-area/ui/textArea'

export const JournalEntryComposer = () => {
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <Card className="bg-white/90">
      <CardHeader className="bg-secondary-background/70 rounded-lg">
        <div className="flex items-center gap-2 text-primary-alt">
          <CalendarDays className="size-4" />
          <span className="font-semibold">{todayLabel}</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-xl bg-primary-alt/10 px-4 py-3">
          <div className="text-sm font-semibold text-primary-alt">How are you feeling today?</div>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <button className="rounded-full bg-white px-3 py-1 shadow-sm">:)</button>
            <button className="rounded-full bg-white px-3 py-1 shadow-sm">:|</button>
            <button className="rounded-full bg-white px-3 py-1 shadow-sm">:(</button>
          </div>
        </div>

        <Textarea placeholder="What's on your mind today?" rows={6} />

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
          <Button size="sm">Save Entry</Button>
        </div>
      </CardContent>
    </Card>
  )
}
