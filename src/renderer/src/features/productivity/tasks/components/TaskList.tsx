import { useState, useMemo } from 'react'
import { TaskItem } from './TaskItem'
import { TaskDetails } from './TaskDetails'
import { useTaskModalStore } from '../store/useTaskModalStore'
import type { Task } from '../types'
import sleepingcat from '@/assets/images/cat/sleep.png'
import { Card, CardContent, CardHeader } from '@/components/card/ui/card'

type TaskListProps = {
  tasks: Task[]
  onCoinEarned?: (amount: number) => void
}

export const TaskList = ({ tasks, onCoinEarned }: TaskListProps) => {
  const [showCompleted, setShowCompleted] = useState(false)
  const selectedTaskId = useTaskModalStore((s) => s.selectedTaskId)

  const { incomplete, completed } = useMemo(() => {
    const completed: Task[] = []
    const incomplete: Task[] = []

    for (const t of tasks) {
      if (t.isComplete) completed.push(t)
      else incomplete.push(t)
    }

    return { incomplete, completed }
  }, [tasks])

  // If there are NO incomplete tasks, show empty state (even if completed exists)
  if (incomplete.length === 0) {
    return (
      <Card>
        <img src={sleepingcat} alt="No tasks" className="w-40 h-auto mb-4" />
        <p className="text-lg font-semibold">You are all caught up! 🐾</p>

        {completed.length > 0 && (
          <button
            onClick={() => setShowCompleted((prev) => !prev)}
            className="mt-4 text-md text-[#6a5555] font-semibold underline"
          >
            {showCompleted ? 'Hide' : 'Show'} Completed ({completed.length})
          </button>
        )}

        {showCompleted && (
          <div className="mt-4 w-full px-2 space-y-2 overflow-y-auto">
            {completed.map((task) => (
              <TaskItem key={task.id} task={task} onCoinEarned={onCoinEarned} />
            ))}
          </div>
        )}
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-heading mb-0">Tasks</CardHeader>
      <CardContent>
        <ul className="space-y-3 not-visited:ml-1 mt-0">
          {incomplete.map((task) => (
            <TaskItem key={task.id} task={task} onCoinEarned={onCoinEarned} />
          ))}
        </ul>

        {completed.length > 0 && (
          <div className="pt-8 mt-2 py-5 ml-2">
            <button
              onClick={() => setShowCompleted((prev) => !prev)}
              className="text-md text-[#6a5555] font-semibold underline mb-1"
            >
              {showCompleted ? 'Hide' : 'Show'} Completed ({completed.length})
            </button>

            {showCompleted && (
              <div className="space-y-3 ml-1 overflow-y-auto">
                {completed.map((task) => (
                  <TaskItem key={task.id} task={task} onCoinEarned={onCoinEarned} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mount the task details dialog once for this list */}
        <TaskDetails taskId={selectedTaskId} />
      </CardContent>
    </Card>
  )
}
