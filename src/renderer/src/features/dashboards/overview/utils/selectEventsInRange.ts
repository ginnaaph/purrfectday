import type { OverviewEvent } from '../types'

export const selectEventsInRange = (
  events: OverviewEvent[],
  range: { start: Date; end: Date }
) => {
  return events.filter((event) => event.endedAt >= range.start && event.endedAt <= range.end)
}
