import { useMemo } from 'react'
import { useOverviewStatsStore } from '../stores/useOverviewStatsStore'
import { selectEventsInRange } from '../utils/selectEventsInRange'
import { buildWeeklyDays } from '../utils/buildWeeklyDays'
import { buildDayRanges } from '../utils/buildDayRanges'
import { buildWeeklySeriesFromEvents } from '../utils/buildWeeklySeriesFromEvents'

export const useOverviewStatsFromStore = (range: { start: Date; end: Date }) => {
  const events = useOverviewStatsStore((s) => s.events)

  const eventsInRange = useMemo(() => selectEventsInRange(events, range), [events, range])
  const weekDays = useMemo(() => buildWeeklyDays(range.start), [range])
  const weekRanges = useMemo(() => buildDayRanges(weekDays), [weekDays])
  const weekly = useMemo(
    () => buildWeeklySeriesFromEvents(eventsInRange, weekRanges),
    [eventsInRange, weekRanges]
  )

  const totals = useMemo(() => {
    const totalPomodoroSessions = weekly.reduce((sum, day) => sum + day.pomodoroSessions, 0)
    const totalFocusMinutes = eventsInRange
      .filter((event) => event.category === 'pomodoro' && event.phase === 'focus' && event.completed)
      .reduce((sum, event) => sum + event.durationSec / 60, 0)
    const totalTasksCompleted = eventsInRange.filter(
      (event) => event.category === 'task' && event.completed
    ).length

    return {
      totalPomodoroSessions,
      totalFocusMinutes: Math.round(totalFocusMinutes),
      totalTasksCompleted
    }
  }, [weekly, eventsInRange])

  return {
    weekly,
    ...totals
  }
}
