import { useQuery } from '@tanstack/react-query'
import { getHabitTasks } from '@/features/recharge/habits/api/getHabitTasks'
import type { Task } from '@/features/productivity/tasks/types'

export const useHabits = () => {
  const query = useQuery({
    queryKey: ['habit_tasks'],
    queryFn: getHabitTasks
  })

  const habits = (query.data?.data ?? []) as Task[]

  return {
    habits,
    isLoading: query.isLoading,
    error: query.error
  }
}
