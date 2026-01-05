import type { TimeSpan } from '@/components/availability/ui/availability'
import type { Timeblock } from '../types/timeblock'

// Utility: HH:mm from Date
export function toHHMM(d: Date): string {
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

// Utility: compute planned duration in minutes
export function computePlannedDurationMinutes(start: Date, end: Date): number {
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000))
}

// Helper: given a base date, return the date in the same week for week_day (0-6)
function dateForWeekday(base: Date, weekDay: number, timeStr: string): Date {
  const result = new Date(base)
  const baseWeekDay = result.getDay()
  const diff = weekDay - baseWeekDay
  result.setDate(result.getDate() + diff)
  const [h, m] = timeStr.split(':').map((x) => parseInt(x, 10))
  result.setHours(h || 0, m || 0, 0, 0)
  return result
}

export function timeblocksToSpans(timeblocks: Timeblock[]): TimeSpan[] {
  return timeblocks.map((tb) => ({
    active: tb.status === 'active' || tb.status === 'planned',
    nanoid: tb.clientId ?? `${tb.id}`,
    week_day: tb.plannedStart.getDay(),
    start_time: toHHMM(tb.plannedStart),
    end_time: toHHMM(tb.plannedEnd)
  }))
}

// Convert spans back to timeblocks, updating existing ones when clientId/nanoid matches.
// For new spans (no match), create a new planned block anchored to the week of the first existing block or to today.
export function spansToTimeblocks(spans: TimeSpan[], existing: Timeblock[]): Timeblock[] {
  const base = existing[0]?.plannedStart ? new Date(existing[0].plannedStart) : new Date()

  const byClientId = new Map<string, Timeblock>()
  for (const tb of existing) {
    if (tb.clientId) byClientId.set(tb.clientId, tb)
  }

  const result: Timeblock[] = []

  for (const s of spans) {
    const matched = byClientId.get(s.nanoid)
    if (matched) {
      const start = dateForWeekday(matched.plannedStart, s.week_day, s.start_time)
      const end = dateForWeekday(matched.plannedStart, s.week_day, s.end_time)
      const updated: Timeblock = {
        ...matched,
        plannedStart: start,
        plannedEnd: end,
        plannedDuration: computePlannedDurationMinutes(start, end),
        status: matched.status ?? 'planned'
      }
      result.push(updated)
    } else {
      const start = dateForWeekday(base, s.week_day, s.start_time)
      const end = dateForWeekday(base, s.week_day, s.end_time)
      result.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        clientId: s.nanoid,
        tags: [],
        plannedStart: start,
        plannedEnd: end,
        plannedDuration: computePlannedDurationMinutes(start, end),
        status: 'planned',
        title: 'Timeblock'
      })
    }
  }

  // If any existing timeblock was removed (span deleted), exclude it
  const spanIds = new Set(spans.map((s) => s.nanoid))
  for (const tb of existing) {
    if (tb.clientId && !spanIds.has(tb.clientId)) {
      // deleted
      continue
    }
  }

  return result
}
