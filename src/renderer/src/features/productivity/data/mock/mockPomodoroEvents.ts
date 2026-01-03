import { buildEvent } from '../../pomodoro/utils/buildEvent'

// Build a small set of mock Pomodoro events across the last 7 days.
const now = new Date()

function daysAgo(days: number) {
  const d = new Date(now)
  d.setDate(now.getDate() - days)
  // normalize to 9:00am start
  d.setHours(9, 0, 0, 0)
  return d
}

// For each day produce between 0..3 focus sessions with 25 minutes each
export const mockPomodoroEvents = (() => {
  const events: Array<ReturnType<typeof buildEvent>> = []
  for (let i = 0; i < 7; i++) {
    const sessions = i % 4 // 0,1,2,3 repeating
    for (let s = 0; s < sessions; s++) {
      const start = new Date(daysAgo(i))
      // stagger sessions by 30 minutes
      start.setMinutes(start.getMinutes() + s * 30)
      const end = new Date(start)
      end.setMinutes(start.getMinutes() + 25)

      events.push(
        buildEvent({
          phase: 'focus',
          startedAt: start,
          endedAt: end,
          completed: true
        })
      )
    }
    // add an occasional completed break event for realism
    if (i % 3 === 0) {
      const bStart = new Date(daysAgo(i))
      bStart.setMinutes(bStart.getMinutes() + 20)
      const bEnd = new Date(bStart)
      bEnd.setMinutes(bStart.getMinutes() + 5)
      events.push(
        buildEvent({
          phase: 'break',
          startedAt: bStart,
          endedAt: bEnd,
          completed: true
        })
      )
    }
  }
  return events
})()

export default mockPomodoroEvents
