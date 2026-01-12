import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/libs/utils'
import { TimeblockCalendarDay } from './TimeblockCalendarDay'
import { TimeblockCalendarWeek } from './TimeblockCalendarWeek'

export type CalendarView = 'day' | 'week'

export function TimeblockCalendar() {
  const [currentDate, setCurrentDate] = React.useState<Date>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12)
  })
  const [view, setView] = React.useState<CalendarView>('week')

  const goToday = () => {
    const now = new Date()
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12))
  }

  const prev = () => {
    setCurrentDate((d) => {
      const diff = view === 'day' ? -1 : -7
      const next = new Date(d)
      next.setDate(d.getDate() + diff)
      return next
    })
  }

  const next = () => {
    setCurrentDate((d) => {
      const diff = view === 'day' ? 1 : 7
      const next = new Date(d)
      next.setDate(d.getDate() + diff)
      return next
    })
  }

  const label = React.useMemo(() => {
    if (view === 'day') {
      return currentDate.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    }
    const start = new Date(currentDate)
    start.setDate(currentDate.getDate() - currentDate.getDay())
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    const s = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    const e = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    return `${s} – ${e}`
  }, [currentDate, view])

  return (
    <div className="flex flex-col gap-3 h-full p-3 min-h-0 shrink">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={prev}>
            Prev
          </Button>
          <Button size="sm" onClick={goToday}>
            Today
          </Button>
          <Button size="sm" onClick={next}>
            Next
          </Button>
        </div>
        <div className="text-heading ">{label}</div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={view === 'day' ? 'default' : 'outline'}
            onClick={() => setView('day')}
            className={cn('')}
          >
            Day
          </Button>
          <Button
            size="sm"
            variant={view === 'week' ? 'default' : 'outline'}
            onClick={() => setView('week')}
          >
            Week
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-hidden rounded-md border border-primary-alt/20 bg-primary-background text-primary-alt">
        {view === 'day' ? (
          <TimeblockCalendarDay currentDate={currentDate} />
        ) : (
          <TimeblockCalendarWeek />
        )}
      </div>
    </div>
  )
}
