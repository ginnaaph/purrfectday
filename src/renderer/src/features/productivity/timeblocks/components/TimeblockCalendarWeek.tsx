import { Availability } from '@/components/availability/ui/availability'
import { useTimeblocks } from '../hooks/useTimeblocks'

export function TimeblockCalendarWeek() {
  const { spans, updateFromSpans } = useTimeblocks()

  return (
    <Availability
      days={[0, 1, 2, 3, 4, 5, 6]}
      value={spans}
      onValueChange={updateFromSpans}
      timeIncrements={30}
      startTime={7}
      endTime={23}
      className="h-full min-h-0"
    />
  )
}
