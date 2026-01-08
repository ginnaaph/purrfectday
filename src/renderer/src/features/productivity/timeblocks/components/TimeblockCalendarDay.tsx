import { Availability } from '@/components/availability/ui/availability'
import { useTimeblocks } from '../hooks/useTimeblocks'

export function TimeblockCalendarDay({ currentDate }: { currentDate: Date }) {
  const { spans, updateFromSpans } = useTimeblocks()
  const day = currentDate.getDay()

  return (
    <Availability
      days={[day]}
      value={spans}
      onValueChange={updateFromSpans}
      timeIncrements={30}
      startTime={4}
      endTime={23}
    />
  )
}
