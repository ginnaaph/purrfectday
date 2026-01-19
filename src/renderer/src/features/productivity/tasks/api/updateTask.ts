// src/api/updateTask.api.ts
import { supabase } from '@/libs/supabaseClient'
import type { Task } from '@/features/productivity/tasks/types'
import { TaskApiUpdateInput } from '@/features/productivity/tasks/types'

const mapTaskRecord = (record: any): Task => ({
  id: record.id,
  title: record.title,
  description: record.description,
  dueDate: record.due_date ? new Date(record.due_date) : null,
  project_id: record.project_id ?? record.list_id ?? null,
  priority: record.priority ?? null,
  estimatedPomodoros: record.estimated_pomodoros ?? 0,
  pomodorosCompleted: record.pomodoros_completed ?? 0,
  isComplete: record.is_complete ?? false,
  completedAt: record.completed_at ? new Date(record.completed_at) : null,
  tags: record.tags ?? [],
  earnedCoins: record.earned_coins ?? 0
})

export const updateTask = async (
  selectedTaskId: number,
  updates: Partial<TaskApiUpdateInput>
): Promise<{ data: Task[] | null; error: Error | null }> => {
  const rawTagsArray =
    updates.tags
      ?.split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0) ?? []

  const updatesForDB = {
    title: updates.title,
    description: updates.description,
    ...(updates.dueDate === undefined
      ? {}
      : {
          due_date:
            updates.dueDate === null
              ? null
              : (updates.dueDate instanceof Date
                  ? updates.dueDate
                  : new Date(updates.dueDate)
                ).toISOString()
        }),
    priority: updates.priority,
    tags: rawTagsArray,
    // Accept updates using either the new `project_id` or legacy `list_id` field.
    project_id: updates.project_id ?? (updates as any).list_id ?? null
  }

  // Include optional fields if provided in the updates object.
  if ((updates as any).estimated_pomodoros !== undefined) {
    ;(updatesForDB as any).estimated_pomodoros = (updates as any).estimated_pomodoros
  }
  if ((updates as any).is_complete !== undefined) {
    ;(updatesForDB as any).is_complete = (updates as any).is_complete
  }
  if ((updates as any).completed_at !== undefined) {
    ;(updatesForDB as any).completed_at = (updates as any).completed_at
      ? (updates as any).completed_at instanceof Date
        ? (updates as any).completed_at.toISOString()
        : new Date((updates as any).completed_at).toISOString()
      : null
  }
  if ((updates as any).earnedCoins !== undefined) {
    ;(updatesForDB as any).earned_coins = (updates as any).earnedCoins
  }

  console.log('🛠 Updating Task:', selectedTaskId, updatesForDB)

  const { data, error } = await supabase
    .from('tasks')
    .update(updatesForDB)
    .eq('id', selectedTaskId)
    .select()

  // Log the raw supabase response for debugging (helps trace why fields didn't update)
  console.log('✅ Supabase update response for task', selectedTaskId, { data, error })
  if (error) {
    console.error('❌ Supabase update error:', error)
  }

  const mapped = data ? data.map(mapTaskRecord) : null

  return { data: mapped, error }
}
