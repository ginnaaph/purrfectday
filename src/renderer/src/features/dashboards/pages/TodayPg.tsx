import { Header } from '../components/Header'
import { TodaysTaskCard } from '../today/components/TodaysTasks'
import { getAllTasks } from '@/features/productivity/tasks/api/getAllTasks'
import { useQuery } from '@tanstack/react-query'
import { getTodaysTaskList } from '../today/utils/isTaskForToday'
// Skeleton handled within TodaysTaskCard
export const TodayPg = () => {
  const query = useQuery({
    queryKey: ['tasks'],
    queryFn: getAllTasks
  })
  const tasks = query.data?.data ?? []
  const todaysTasks = getTodaysTaskList(tasks)

  return (
    <div className="overflow-hidden flex-col flex mr-4">
      <Header />
      <div className="flex flex-col lg:flex-row gap-1 h-full space-x-4 lg:space-y-0">
        <div className="flex-1 h-full overflow-auto space-y-3">
          <section className="p-3 w-full">
            <div>Pet card goes here</div>
          </section>
        </div>
        <div className="flex-1 space-y-4 h-full overflow-auto pr-7">
          <TodaysTaskCard tasks={todaysTasks} isLoading={query.isLoading} />
        </div>
      </div>
    </div>
  )
}
