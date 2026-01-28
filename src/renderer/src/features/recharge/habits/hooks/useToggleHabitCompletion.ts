import { useMutation } from '@tanstack/react-query'
import { upsertHabitLog } from '@/features/recharge/habits/api/upsertHabitLog'
import { awardCoinsForHabitLog } from '@/features/recharge/habits/api/awardCoinsForHabitLog'
import { queryClient } from '@/libs/QueryClient'
import type { HabitLogStatus } from '@/features/recharge/habits/types'

export type ToggleHabitCompletionInput = {
  taskId: number
  logDate: string
  nextStatus: HabitLogStatus
  coinAmount?: number
}

export const useToggleHabitCompletion = () => {
  return useMutation({
    mutationFn: async ({
      taskId,
      logDate,
      nextStatus,
      coinAmount = 1
    }: ToggleHabitCompletionInput) => {
      const { data, error } = await upsertHabitLog({
        task_id: taskId,
        log_date: logDate,
        status: nextStatus
      })
      if (error) throw error

      if (data && nextStatus === 'completed') {
        const { error: coinError } = await awardCoinsForHabitLog({
          habit_log_id: data.id,
          amount: coinAmount
        })
        if (coinError) throw coinError
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habit_logs'] })
      queryClient.invalidateQueries({ queryKey: ['coin_balance'] })
    },
    onError: (err) => {
      console.error('Habit log update failed:', err)
    }
  })
}
