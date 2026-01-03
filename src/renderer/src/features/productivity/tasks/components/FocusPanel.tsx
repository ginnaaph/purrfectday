import TaskSelect from '@/features/productivity/tasks/components/TaskSelect'
import { useTaskStore } from '@/features/productivity/tasks/store/useTaskStore'
import { useLoadTasksIfEmpty } from '@/features/productivity/tasks/hooks/useLoadTasksIfEmpty'
import { Button } from '@/components/ui/button'

const FocusPanel = () => {
  const { tasks } = useLoadTasksIfEmpty()
  const activeTaskId = useTaskStore((s) => s.activeTaskId)
  const setActiveTaskId = useTaskStore((s) => s.setActiveTaskId)
  const activeTask = (tasks ?? []).find((t) => t.id === activeTaskId) || null

  if (!activeTask) return <TaskSelect />

  return (
    <div className="text-center mt-2 text-[#6a5555] bg-[#fef6e4] px-2 py-2  gap-2 rounded shadow-sm">
      <p className="text-md uppercase opacity-70 tracking-wider">Focusing on</p>
      <h2 className="text-xl font-semibold">{activeTask.title}</h2>
      <p className="text-sm">
        ⏱ {activeTask.pomodorosCompleted || 0} / {activeTask.estimatedPomodoros || 1} Pomodoros
      </p>
      <Button onClick={() => setActiveTaskId(null)} variant="outline" size="sm">
        ✘ Clear focus
      </Button>
    </div>
  )
}

export default FocusPanel
