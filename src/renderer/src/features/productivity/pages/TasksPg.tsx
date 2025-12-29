import { useQuery } from '@tanstack/react-query'
import { getAllTasks } from '../tasks/api/getAllTasks'
import { TaskList } from '../tasks/components/TaskList'

export const TasksPg = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: getAllTasks
  })

  const tasks = data?.data ?? []

  if (isLoading) {
    return <div className="p-4 text-[#6a5555]">Loading tasks…</div>
  }

  if (isError) {
    return <div className="p-4 text-red">Failed to load tasks.</div>
  }

  return (
    <div className="w-full overflow-hidden flex flex-col">
      <div className="p-3">
        <h2 className="bg-lightgreen text-center text-[#6a5555] py-2 rounded-xl">Tasks</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-2 bg-white/60 rounded-xl">
        <TaskList tasks={tasks} />
      </div>
    </div>
  )
}
