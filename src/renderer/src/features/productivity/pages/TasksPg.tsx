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
    <div className="h-screen w-full bg-[#f9f7f4] flex flex-row gap-6 px-3 py-4 mr-3 ml-3 rounded-xl overflow-hidden">
      <div className="w-2/3 flex flex-col h-full min-h-0">Timeblock compoent goes here</div>
      <div className="w-1/3 flex flex-col h-full min-h-0 justify-between mr-4">
        <div className="flex-1 min-h-0 flex flex-col overflow-auto mr-6 pr-1">
          <div className="mt-3">
          <TaskList tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  )
}
