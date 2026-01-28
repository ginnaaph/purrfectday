export const toLocalDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const startOfDay = (date: Date) => {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return start
}

export const getWeekStart = (date: Date) => {
  const start = startOfDay(date)
  const day = start.getDay()
  start.setDate(start.getDate() - day)
  return start
}

export const getWeekDays = (date: Date) => {
  const start = getWeekStart(date)
  return Array.from({ length: 7 }, (_, i) => {
    const next = new Date(start)
    next.setDate(start.getDate() + i)
    return next
  })
}

export const isHabitScheduledForDate = (
  scheduleDays: number[] | null | undefined,
  date: Date
) => {
  if (!scheduleDays || scheduleDays.length === 0) return true
  return scheduleDays.includes(date.getDay())
}
