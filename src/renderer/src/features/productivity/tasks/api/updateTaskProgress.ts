import { supabase } from '@/libs/supabaseClient'

export async function updateTaskProgress(
  taskId: number,
  updates: {
    earnedCoins?: number
    dueDate?: Date | null
    isComplete?: boolean
    completedAt?: Date | null
    pomodorosCompleted?: number
  }
) {
  const payload = Object.fromEntries(
    Object.entries({
      earned_coins: updates.earnedCoins,
      due_date:
        updates.dueDate === undefined
          ? undefined
          : updates.dueDate === null
            ? null
            : updates.dueDate.toISOString(),
      is_complete: updates.isComplete,
      completed_at:
        updates.completedAt === undefined
          ? undefined
          : updates.completedAt === null
            ? null
            : updates.completedAt.toISOString(),
      pomodoros_completed: updates.pomodorosCompleted,
    }).filter(([, v]) => v !== undefined)
  )

  console.log('updateTaskProgress payload:', payload)

  const { data, error } = await supabase.from('tasks').update(payload).eq('id', taskId)

  if (error) {
    console.error('Supabase update error:', error)
  } else {
    console.log('Supabase update success:', data)
  }

  return { data, error }
}
