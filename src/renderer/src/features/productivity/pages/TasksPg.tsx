import { useQuery } from '@tanstack/react-query'
import { getAllTasks } from '../tasks/api/getAllTasks'
import { TaskList } from '../tasks/components/TaskList'
import { TimeblockCalendar } from '../timeblocks/components/TimeblockCalendar'
import { PomodoroWidget } from '../pomodoro/components/PomodoroWidget'
import { useFilteredTasks } from '../tasks/hooks/useFilteredTasks'
export const TasksPg = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: getAllTasks
  })

  const tasks = data?.data ?? []
  const { tasks: filteredTasks } = useFilteredTasks(tasks)

  if (isLoading) {
    return <div className="p-4 text-[#6a5555]">Loading tasks…</div>
  }

  if (isError) {
    return <div className="p-4 text-red">Failed to load tasks.</div>
  }

  return (
    <div className="h-screen w-full shrink bg-[#f9f7f4] flex flex-row gap-4 p-3 overflow-hidden">
      <div className="flex-1 p-2 flex flex-col h-full min-h-0">
        <div className="flex-1 flex shrink flex-col overflow-hidden">
          <TimeblockCalendar />
        </div>
      </div>
      <div className="flex -full flex-col h-full justify-between overflow-hidden ">
      <div className="flex-1 flex flex-col overflow-hidden">
          <TaskList tasks={filteredTasks} />
        </div>
        <div className="flex flex-col items-center py-2">
          <PomodoroWidget />
        </div>
      </div>
    </div>
  )
}
