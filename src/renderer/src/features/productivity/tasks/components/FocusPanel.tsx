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
    <div className="text-center mt-10 text-white flex flex-col bg-secondary-background/60 p-6  px-10 gap-3 rounded shadow-sm justify-center ">
      <p className="text-md uppercase opacity-70 tracking-wider text-text-secondary">Focusing on</p>
      <h2 className="text-xl font-semibold text-cool-accent">{activeTask.title}</h2>
      <p className="text-sm text-text-secondary mb-4 mt-4">
        ⏱ {activeTask.pomodorosCompleted || 0} / {activeTask.estimatedPomodoros || 1} Pomodoros
      </p>
      <Button onClick={() => setActiveTaskId(null)} variant="outline" size="sm">
        ✘ Clear focus
      </Button>
    </div>
  )
}

export default FocusPanel
