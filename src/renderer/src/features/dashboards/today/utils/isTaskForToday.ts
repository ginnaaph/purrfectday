import {
  startOfDay,
  startOfNextDay,
  normalizeDueDate,
  normalizeCompletedAt,
} from '@/utils/dates-time/dateHelperFn'
import type { Task } from '@/features/productivity/tasks/types'
// rule: undated counts; else same-calendar-day as now
// "today" = same local day as now or undated, invalid dates = undated
export function isTaskForToday(task: Task, now = new Date()) {
  const dueDate = normalizeDueDate(task.dueDate)
  if (dueDate === null) {
    return !task.isComplete
  }

  const startOfToday = startOfDay(now)
  const startOfTomorrow = startOfNextDay(now)

  return dueDate >= startOfToday && dueDate < startOfTomorrow
}
export const isCompletedOnDay = (t: Task, now: Date = new Date()) => {
  const completed = normalizeCompletedAt(t.completedAt)
  return !!completed && completed >= startOfDay(now) && completed < startOfNextDay(now)
}

export function getTodaysTaskList(tasks: Task[], now = new Date()): Task[] {
  return tasks.filter((t) => isTaskForToday(t, now))
}
