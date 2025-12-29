import type { Task } from '@/features/productivity/tasks/types'
// returns local midnight for a given date
export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

// returns local midnight for the next day
export function startOfNextDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
}

export function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
}

// returns start of week (Monday) for a given date
export function startOfWeek(d: Date) {
  const day = d.getDay() // 0 (Mon) to 6 (Sun)
  const diff = (day === 0 ? -6 : 1) - day
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff)
}
// returns end of week (next Monday) for a given date
export function endOfWeek(d: Date) {
  const start = startOfWeek(d)
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7)
}

// returns start of month for a given date
export function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
// returns end of month (start of next month) for a given date
export function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 1)
}

// guards against invalid Dates
export function isValidDate(d: unknown): boolean {
  return d instanceof Date && !Number.isNaN(d.getTime())
}

// treat missing isComplete as false
export function isDone(t: Task): boolean {
  return t.isComplete ?? false
}

export function normalizeCompletedAt(completedAt: Date | string | null | undefined): Date | null {
  if (!completedAt) return null
  if (completedAt instanceof Date) return !isNaN(completedAt.getTime()) ? completedAt : null
  if (typeof completedAt === 'string') {
    const d = new Date(completedAt)
    return !isNaN(d.getTime()) ? d : null
  }
  return null
}

// normalize dueDate; if invalid → return null (so you can treat as undated)
export function normalizeDueDate(dueDate: Date | null | undefined): Date | null {
  if (!dueDate) {
    return null
  }
  if (dueDate instanceof Date) {
    return !isNaN(dueDate.getTime()) ? dueDate : null
  }
  if (typeof dueDate === 'string') {
    const d = new Date(dueDate)
    return !isNaN(d.getTime()) ? d : null
  }
  return null
}
