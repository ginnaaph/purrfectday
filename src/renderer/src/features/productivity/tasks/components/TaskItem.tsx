import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Trash from '@/assets/images/icons/trash.png'
import Tomato from '@/assets/images/icons/tomato.png'
import type { Task } from '../types'
import { useTaskModalStore } from '../store/useTaskModalStore'
import { deleteTask } from '@/features/productivity/tasks/api/deleteTask'
import { queryClient } from '@/libs/QueryClient'
import { useFocusTaskStore } from '../store/useFocusTaskStore'
import { useCoinsStore } from '@/features/shop/coins/store/useCoinStore'

import { Checkbox } from '@/components/checkbox/ui/checkbox'

import { updateTaskProgress } from '../api/updateTaskProgress'

type TaskItemProps = {
  task: Task
  onCoinEarned?: (amount: number) => void
}

const COINS_PER_TASK_COMPLETE = 1

export const TaskItem = ({ task, onCoinEarned }: TaskItemProps) => {
  const navigate = useNavigate()
  const openTaskModal = useTaskModalStore((s) => s.open)

  // ID-based focus (recommended for PurrfectDay)
  const setFocusedTaskId = useFocusTaskStore((s) => s.setFocusedTaskId)

  const addCoins = useCoinsStore((s) => s.addCoins)

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
  })

  const toggleCompleteMutation = useMutation({
    mutationFn: async (nextChecked: boolean) => {
      // If user clicks but nothing changes, bail early
      if (nextChecked === task.isComplete) return

      if (nextChecked) {
        const nextEarned = (task.earnedCoins ?? 0) + COINS_PER_TASK_COMPLETE
        const now = new Date()

        const { error } = await updateTaskProgress(task.id, {
          isComplete: true,
          completedAt: now,
          earnedCoins: nextEarned
        })
        if (error) throw error

        // Only award coins after server success
        addCoins(COINS_PER_TASK_COMPLETE)
        onCoinEarned?.(COINS_PER_TASK_COMPLETE)
      } else {
        const { error } = await updateTaskProgress(task.id, {
          isComplete: false,
          completedAt: null,
          earnedCoins: 0 // remove this line if you want to keep historical earnedCoins
        })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  // date labels
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const taskDate = task.dueDate ? new Date(task.dueDate) : null
  if (taskDate) taskDate.setHours(0, 0, 0, 0)

  const isDueToday = taskDate?.getTime() === today.getTime()
  const isOverdue = Boolean(taskDate && taskDate < today && !isDueToday && !task.isComplete)

  return (
    <li className="flex items-center w-full gap-1 overflow-hidden bg-lightbeige/30 px-2 py-1 rounded-xl shadow-sm hover:shadow-sm transition-shadow mb-3">
      <div className="flex flex-col w-full ml-1">
        <div className="flex items-start p-2 w-full gap-3">
          <Checkbox
            checked={task.isComplete}
            disabled={toggleCompleteMutation.isPending}
            onCheckedChange={(checked) => {
              const nextChecked = checked === true
              toggleCompleteMutation.mutate(nextChecked)
            }}
            aria-label={`Mark ${task.title} complete`}
          />

          <div className="flex flex-col w-full">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                openTaskModal(task.id)
              }}
              className={`text-left font-semibold hover:underline ${
                task.isComplete ? 'line-through text-red' : ''
              }`}
            >
              {task.title}
            </button>

            {task.dueDate && (
              <span className={`text-xs mt-1 ${isOverdue ? 'text-red' : 'text-brown'}`}>
                {isDueToday ? 'Due Today' : `Due ${new Date(task.dueDate).toLocaleDateString()}`}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mr-1 flex items-center gap-2">
        {task.priority && (
          <span
            className={`mt-1 text-xs px-3 py-[2px] rounded-full w-fit ${
              task.priority === 'high'
                ? 'bg-[#f5d7d7] text-red-2'
                : task.priority === 'medium'
                  ? 'bg-[#fdf9ce] text-yellow-2'
                  : 'bg-[#dcecc3] text-green'
            }`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        )}

        <button
          className="hover:bg-[#f5e8da] py-2 text-[#6a5555] text-md"
          aria-label="focus on task"
          onClick={() => {
            setFocusedTaskId(task.id)
            navigate('/pomodoro', { state: { focusFromTaskList: true } })
          }}
        >
          <img src={Tomato} alt="Focus" className="h-4 w-4" />
        </button>

        <button
          onClick={() => deleteMutation.mutate(task.id)}
          className="text-[#6a5555] text-md ml-2"
          data-testid="delete-button"
          aria-label="delete task"
          disabled={deleteMutation.isPending}
        >
          <img src={Trash} alt="Delete" className="h-4 w-4" />
        </button>
      </div>
    </li>
  )
}
