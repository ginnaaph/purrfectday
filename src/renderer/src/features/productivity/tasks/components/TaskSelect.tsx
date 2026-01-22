import { useTaskStore } from '@/features/productivity/tasks/store/useTaskStore'
import { useLoadTasksIfEmpty } from '../hooks/useLoadTasksIfEmpty'

const TaskSelect = () => {
  // React Query is the single source of truth for tasks
  const { tasks } = useLoadTasksIfEmpty()
  // Store only holds UI/session state
  const setActiveTaskId = useTaskStore((s) => s.setActiveTaskId)
  const incompleteTask = (tasks ?? []).filter((t) => !t.isComplete)

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (!value) {
      setActiveTaskId(null)
      return
    }
    const id = Number(value)
    setActiveTaskId(Number.isFinite(id) ? id : null)
  }

  return (
    <div className="mt-5 text-center gap-3">
      <label className="block font-bold text-[#6a5555] mb-1  text-lg py-2">Select a task</label>
      <select
        className="bg-secondary-background rounded px-2 py-1 text-sm text-center mt-3"
        onChange={handleSelect}
        defaultValue=""
      >
        <option value="" className="text-center">
          — No focus —
        </option>
        {incompleteTask.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>
    </div>
  )
}

export default TaskSelect
