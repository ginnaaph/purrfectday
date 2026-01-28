import { supabase } from '@/libs/supabaseClient'
import type { HabitLog } from '@/features/recharge/habits/types'

export type HabitLogRange = {
  startDate: string
  endDate: string
}

const mapHabitLog = (record: any): HabitLog => ({
  id: record.id,
  task_id: record.task_id,
  log_date: record.log_date,
  status: record.status,
  completed_at: record.completed_at ? new Date(record.completed_at) : null,
  created_at: record.created_at ? new Date(record.created_at) : null
})

export const getHabitLogs = async ({
  startDate,
  endDate
}: HabitLogRange): Promise<{ data: HabitLog[] | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .gte('log_date', startDate)
    .lte('log_date', endDate)

  const mapped = data ? data.map(mapHabitLog) : null
  return { data: mapped, error }
}
