import { supabase } from '@/libs/supabaseClient'
import type { CoinTransaction } from '@/features/shop/coins/types'

export type AwardHabitCoinsInput = {
  habit_log_id: string
  amount: number
}

const mapCoinTransaction = (record: any): CoinTransaction => ({
  id: record.id,
  habit_log_id: record.habit_log_id ?? null,
  task_id: record.task_id ?? null,
  amount: record.amount,
  source: record.source,
  created_at: record.created_at ? new Date(record.created_at) : null
})

export const awardCoinsForHabitLog = async ({
  habit_log_id,
  amount
}: AwardHabitCoinsInput): Promise<{ data: CoinTransaction | null; error: Error | null }> => {
  const payload = {
    habit_log_id,
    amount,
    source: 'habit_completed'
  }

  const { data, error } = await supabase
    .from('coin_transactions')
    .upsert(payload, {
      onConflict: 'habit_log_id,source',
      ignoreDuplicates: true
    })
    .select()
    .maybeSingle()

  return { data: data ? mapCoinTransaction(data) : null, error }
}
