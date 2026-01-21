export const buildWeeklyDays = (anchorDate: Date) => {
  const base = new Date(anchorDate)
  base.setHours(0, 0, 0, 0)
  const startOfWeek = new Date(base)
  startOfWeek.setDate(base.getDate() - base.getDay())

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + index)
    return day
  })
}
