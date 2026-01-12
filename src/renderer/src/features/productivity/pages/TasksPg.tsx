import { useQuery } from '@tanstack/react-query'
import { getAllTasks } from '../tasks/api/getAllTasks'
import { TaskList } from '../tasks/components/TaskList'
import { TimeblockCalendar } from '../timeblocks/components/TimeblockCalendar'
import { PomodoroWidget } from '../pomodoro/components/PomodoroWidget'
import { useFilteredTasks } from '../tasks/hooks/useFilteredTasks'
import { TaskDashboardLayout } from './TaskDashboardLayout'
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
    <TaskDashboardLayout
      taskList={
        <>
          <div className="flex-1 flex flex-col overflow-y-auto px-2 bg-white/60 rounded-xl">
            <TaskList tasks={filteredTasks} />
          </div>
        </>
      }
      timeblock={<TimeblockCalendar />}
      pomodoroWidget={<PomodoroWidget />}
    />
  )
}
