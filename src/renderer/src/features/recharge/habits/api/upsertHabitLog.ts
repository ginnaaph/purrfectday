import { supabase } from '@/libs/supabaseClient'
import type { HabitLog, HabitLogStatus } from '@/features/recharge/habits/types'

export type UpsertHabitLogInput = {
  task_id: number
  log_date: string
  status: HabitLogStatus
}

const mapHabitLog = (record: any): HabitLog => ({
  id: record.id,
  task_id: record.task_id,
  log_date: record.log_date,
  status: record.status,
  completed_at: record.completed_at ? new Date(record.completed_at) : null,
  created_at: record.created_at ? new Date(record.created_at) : null
})

export const upsertHabitLog = async ({
  task_id,
  log_date,
  status
}: UpsertHabitLogInput): Promise<{ data: HabitLog | null; error: Error | null }> => {
  const completed_at = status === 'completed' ? new Date().toISOString() : null
  const { data, error } = await supabase
    .from('habit_logs')
    .upsert(
      {
        task_id,
        log_date,
        status,
        completed_at
      },
      { onConflict: 'task_id,log_date' }
    )
    .select()
    .maybeSingle()

  return { data: data ? mapHabitLog(data) : null, error }
}
