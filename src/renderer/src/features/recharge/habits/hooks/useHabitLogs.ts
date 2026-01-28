import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getHabitLogs } from '@/features/recharge/habits/api/getHabitLogs'
import type { HabitLog } from '@/features/recharge/habits/types'
import { toLocalDateKey } from '@/features/recharge/habits/utils/dateUtils'

export const useHabitLogs = (weekDays: Date[]) => {
  const startDate = toLocalDateKey(weekDays[0])
  const endDate = toLocalDateKey(weekDays[weekDays.length - 1])

  const query = useQuery({
    queryKey: ['habit_logs', startDate, endDate],
    queryFn: () => getHabitLogs({ startDate, endDate })
  })

  const logs = (query.data?.data ?? []) as HabitLog[]

  const logMap = useMemo(() => {
    const map = new Map<string, HabitLog>()
    logs.forEach((log) => {
      map.set(`${log.task_id}-${log.log_date}`, log)
    })
    return map
  }, [logs])

  const isCompleted = (taskId: number, date: Date) => {
    const key = `${taskId}-${toLocalDateKey(date)}`
    return logMap.get(key)?.status === 'completed'
  }

  const getLog = (taskId: number, date: Date) => {
    const key = `${taskId}-${toLocalDateKey(date)}`
    return logMap.get(key) ?? null
  }

  return {
    logs,
    isLoading: query.isLoading,
    error: query.error,
    isCompleted,
    getLog,
    startDate,
    endDate
  }
}
