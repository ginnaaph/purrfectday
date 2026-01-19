import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/libs/QueryClient'
import { updateTask } from '../api/updateTask'
import { selectATask } from '../api/selectATask'
import { Task, TaskApiUpdateInput } from '../types'

export function useTaskDetailData(taskId: number | null) {
  const { data: task } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => selectATask(taskId!),
    enabled: !!taskId
  })
  type updateTaskParams = {
    taskId: number
    updates: Partial<TaskApiUpdateInput>
  }
  const mutation = useMutation({
    mutationFn: ({ taskId, updates }: updateTaskParams) => updateTask(taskId, updates),
    onSuccess: async (result, variables) => {
      const updated = result.data?.[0]
      if (updated) {
        queryClient.setQueryData(['task', variables.taskId], updated)
        queryClient.setQueryData(['tasks'], (old) => {
          if (!old || typeof old !== 'object') return old
          const current = (old as { data?: Task[] }).data ?? []
          const next = current.map((task) => (task.id === updated.id ? updated : task))
          return { ...(old as object), data: next }
        })
      }
      // Invalidate both the individual task and the main tasks list
      await queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] })
      await queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error, variables) => {
      console.error('[useTaskDetailData] updateTask error for id:', variables?.taskId, error)
    }
  })
  return {
    task,
    updateTaskMutation: mutation
  }
}
