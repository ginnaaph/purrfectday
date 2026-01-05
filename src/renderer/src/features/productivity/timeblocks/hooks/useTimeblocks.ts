import { useCallback, useMemo, useState } from 'react'
import type { TimeSpan } from '@/components/availability/ui/availability'
import type { Timeblock } from '../types/timeblock'
import { spansToTimeblocks, timeblocksToSpans } from '../mappers/timeblockMapper'

export function useTimeblocks(initial: Timeblock[] = []) {
  const [timeblocks, setTimeblocks] = useState<Timeblock[]>(initial)

  const spans: TimeSpan[] = useMemo(() => timeblocksToSpans(timeblocks), [timeblocks])

  const updateFromSpans = useCallback((nextSpans: TimeSpan[]) => {
    setTimeblocks((prev) => spansToTimeblocks(nextSpans, prev))
  }, [])

  return { timeblocks, setTimeblocks, spans, updateFromSpans }
}
