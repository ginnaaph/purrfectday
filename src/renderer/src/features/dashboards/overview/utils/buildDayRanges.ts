import type { DayRange } from '../types'

export const buildDayRanges = (days: Date[]): DayRange[] => {
  return days.map((day) => {
    const start = new Date(day)
    start.setHours(0, 0, 0, 0)
    const end = new Date(day)
    end.setHours(23, 59, 59, 999)
    return { start, end }
  })
}
