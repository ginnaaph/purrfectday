import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card/ui/card'
import { useOverviewStatsFromStore } from '@/features/dashboards/overview/hooks/useOverviewStatsFromStore'

type RangePreset = 'today' | 'week' | 'month'

const buildRangeForPreset = (preset: RangePreset) => {
  const now = new Date()
  if (preset === 'today') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    return { start, end }
  }

  if (preset === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    return { start, end }
  }

  const start = new Date(now)
  start.setDate(now.getDate() - now.getDay())
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

export const OverviewPg = () => {
  const [preset, setPreset] = useState<RangePreset>('week')
  const range = useMemo(() => buildRangeForPreset(preset), [preset])
  const { totalPomodoroSessions, totalFocusMinutes, totalTasksCompleted } =
    useOverviewStatsFromStore(range)

  return (
    <div className="w-full h-full min-h-0 overflow-hidden flex flex-col p-4 gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-3xl font-bold text-primary-alt">Overview</div>
          <div className="text-sm text-primary-alt/70">Your weekly insights</div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={preset === 'today' ? 'default' : 'outline'}
            onClick={() => setPreset('today')}
          >
            Today
          </Button>
          <Button
            size="sm"
            variant={preset === 'week' ? 'default' : 'outline'}
            onClick={() => setPreset('week')}
          >
            This Week
          </Button>
          <Button
            size="sm"
            variant={preset === 'month' ? 'default' : 'outline'}
            onClick={() => setPreset('month')}
          >
            This Month
          </Button>
        </div>
      </div>

      <div className="grid min-h-0 gap-4 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)] auto-rows-fr">
        <div className="flex flex-col gap-4 min-h-0">
          <Card className="bg-primary-background/70 flex flex-col">
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Place Holder card</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 flex flex-col">
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-primary-alt/80">
              <div className="flex items-center justify-between">
                <span>Focus sessions</span>
                <span className="font-semibold text-primary-alt">{totalPomodoroSessions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Focus minutes</span>
                <span className="font-semibold text-primary-alt">{totalFocusMinutes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tasks completed</span>
                <span className="font-semibold text-primary-alt">{totalTasksCompleted}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary-alt/10 flex flex-col">
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Tasks Completed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-primary-alt/80">
              <div className="text-2xl font-semibold text-primary-alt">{totalTasksCompleted}</div>
              <div className="h-2 w-full rounded-full bg-primary-alt/10">
                <div
                  className="h-2 rounded-full bg-primary-alt/60"
                  style={{ width: `${Math.min(100, totalTasksCompleted * 10)}%` }}
                />
              </div>
              <div className="text-xs text-primary-alt/60">Keep going, you are on track.</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 flex flex-col min-h-0">
          <CardHeader className="py-3">
            <CardTitle className="text-lg">Placeholder for another Card</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <div className="h-full min-h-0 rounded-xl border border-dashed border-primary-alt/20 bg-primary-background/60" />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 flex flex-col min-h-0 flex-1">
        <CardHeader className="py-3">
          <CardTitle className="text-lg">Stats</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 flex flex-col gap-3">
          <div className="flex-1 min-h-0 rounded-xl border border-dashed border-primary-alt/20 bg-primary-background/60" />
          <div className="flex items-center gap-4 text-xs text-primary-alt/70">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-primary-alt/60" />
              Pomodoro Sessions
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-secondary-alt/60" />
              Tasks Completed
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
