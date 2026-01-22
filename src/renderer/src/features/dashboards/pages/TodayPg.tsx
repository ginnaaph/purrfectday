import { Header } from '../components/Header'
import { TodaysTaskCard } from '../today/components/TodaysTasks'
import { DailyProgressCard } from '../today/components/DailyProgressCard'
import { HabitTrackerCard } from '../today/components/HabitTrackerCard'
import { getAllTasks } from '@/features/productivity/tasks/api/getAllTasks'
import { useQuery } from '@tanstack/react-query'
import { getTodaysTaskList } from '../today/utils/isTaskForToday'
import { PetDashboardCard } from '@/features/cat/components/PetDashboardCard'
// Skeleton handled within TodaysTaskCard
export const TodayPg = () => {
  const query = useQuery({
    queryKey: ['tasks'],
    queryFn: getAllTasks
  })
  const tasks = query.data?.data ?? []
  const todaysTasks = getTodaysTaskList(tasks)
  const completedToday = todaysTasks.filter((task) => task.isComplete).length
  const totalTodayTask = todaysTasks.length

  return (
    <div className="overflow-hidden  gap-y-5 flex flex-col ml-5 pl-3 h-screen w-full">
      <Header />
      <div className="flex flex-col md:flex-row gap-6 h-full mt-1 shrink ">
        <div className="flex-1 h-full overflow-auto space-y-3">
          <section className="p-3 w-full shrink">
            <PetDashboardCard />
          </section>
          <section className="p-3 w-full shrink">
            <HabitTrackerCard tasks={tasks} isLoading={query.isLoading} />
          </section>
        </div>
        <div className="flex flex-1 flex-col h-full gap-5 overflow-y-auto shrink">
          <div className="flex-1 shrink">
            <TodaysTaskCard tasks={todaysTasks} isLoading={query.isLoading} />
          </div>
          <div className="flex-1 shrink">
            <DailyProgressCard tasksCompleted={completedToday} tasksTotal={totalTodayTask} />
          </div>
        </div>
      </div>
    </div>
  )
}
