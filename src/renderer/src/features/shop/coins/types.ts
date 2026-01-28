export type CoinTransactionSource = 'habit_completed' | 'task_completed' | 'focus_completed'

export type CoinTransaction = {
  id: string
  habit_log_id?: string | null
  task_id?: number | null
  amount: number
  source: CoinTransactionSource
  created_at?: Date | null
}
