import { Flame } from 'lucide-react'
import { Card } from '@/components/card/ui/card'

export const JournalStreakBar = () => {
  return (
    <Card className="bg-secondary-background/70 border border-primary-alt/10">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary-alt/15 p-2">
              <Flame className="size-4 text-primary-alt" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-primary-alt/70">
                Current Streak
              </div>
              <div className="text-lg font-semibold text-primary-alt">0 days</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary-alt/15 p-2">
              <Flame className="size-4 text-primary-alt" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-primary-alt/70">
                Longest Streak
              </div>
              <div className="text-lg font-semibold text-primary-alt">0 days</div>
            </div>
          </div>
        </div>
        <div className="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-primary-alt">
          Start your streak today!
        </div>
      </div>
    </Card>
  )
}
