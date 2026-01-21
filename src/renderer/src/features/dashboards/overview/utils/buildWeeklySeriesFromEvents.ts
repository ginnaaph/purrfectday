import type { DayRange, OverviewEvent, WeeklySeriesItem } from '../types'

const labelForDay = (day: Date) =>
  day.toLocaleDateString(undefined, { weekday: 'short' })

export const buildWeeklySeriesFromEvents = (
  events: OverviewEvent[],
  ranges: DayRange[]
): WeeklySeriesItem[] => {
  return ranges.map((range) => {
    const eventsForDay = events.filter(
      (event) => event.endedAt >= range.start && event.endedAt <= range.end
    )

    const pomodoroSessions = eventsForDay.filter(
      (event) => event.category === 'pomodoro' && event.phase === 'focus' && event.completed
    ).length

    const tasksCompleted = eventsForDay.filter(
      (event) => event.category === 'task' && event.completed
    ).length

    const focusMinutes = Math.round(
      eventsForDay
        .filter((event) => event.category === 'pomodoro' && event.phase === 'focus' && event.completed)
        .reduce((sum, event) => sum + event.durationSec / 60, 0)
    )

    return {
      label: labelForDay(range.start),
      date: range.start,
      pomodoroSessions,
      tasksCompleted,
      focusMinutes
    }
  })
}
