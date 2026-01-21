export type OverviewEventCategory = 'pomodoro' | 'task'
export type OverviewEventPhase = 'focus' | 'break'

export interface OverviewEvent {
  id: number
  category: OverviewEventCategory
  phase?: OverviewEventPhase
  startedAt: Date
  endedAt: Date
  durationSec: number
  completed: boolean
}

export interface DayRange {
  start: Date
  end: Date
}

export interface WeeklySeriesItem {
  label: string
  date: Date
  pomodoroSessions: number
  tasksCompleted: number
  focusMinutes: number
}
