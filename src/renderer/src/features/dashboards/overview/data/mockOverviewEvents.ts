import type { OverviewEvent } from '../types'

const now = new Date()
const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9)

const mockOverviewEvents: OverviewEvent[] = [
  {
    id: 1,
    category: 'pomodoro',
    phase: 'focus',
    startedAt: new Date(startOfToday),
    endedAt: new Date(startOfToday.getTime() + 25 * 60 * 1000),
    durationSec: 25 * 60,
    completed: true
  },
  {
    id: 2,
    category: 'pomodoro',
    phase: 'focus',
    startedAt: new Date(startOfToday.getTime() + 60 * 60 * 1000),
    endedAt: new Date(startOfToday.getTime() + 85 * 60 * 1000),
    durationSec: 25 * 60,
    completed: true
  },
  {
    id: 3,
    category: 'task',
    startedAt: new Date(startOfToday.getTime() + 2 * 60 * 60 * 1000),
    endedAt: new Date(startOfToday.getTime() + 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
    durationSec: 5 * 60,
    completed: true
  }
]

export default mockOverviewEvents
