import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/libs/QueryClient'
import { updateTaskProgress } from '@/features/productivity/tasks/api/updateTaskProgress'
import { useCoinsStore } from '@/features/shop/coins/store/useCoinStore'
import { Card, CardTitle, CardContent, CardHeader } from '@/components/card/ui/card'
import { Skeleton } from '@/components/side-bar/components/ui/skeleton'
import { Checkbox } from '@/components/checkbox/ui/checkbox'
import { Button } from '@/components/ui/button'
import { AddTask } from '@/features/productivity/tasks/components/AddTask'
import { Dialog, DialogTrigger, DialogContent } from '@/components/dialog/ui/dialog'
import { parseDateOnly, toDateOnlyString } from '@/utils/dates-time/dateHelperFn'

type TodaysTask = {
  id: number
  title: string
  isComplete: boolean
  completedAt?: Date | null
  earnedCoins?: number
  priority?: 'low' | 'medium' | 'high' | null
  dueDate?: Date | null
  type?: 'habit' | 'task' | null
}

type TodaysTaskCardProps = {
  tasks: {
    id: number
    title: string
    isComplete: boolean
    completedAt?: Date | null
    priority?: 'low' | 'medium' | 'high' | null
    dueDate?: Date | null
    type?: 'habit' | 'task' | null
  }[]
  onCoinsEarned?: (amount: number) => void
  coinsPerTask?: number
  isLoading?: boolean
}
export const TodaysTaskCard = ({
  tasks,
  onCoinsEarned,
  coinsPerTask = 1,
  isLoading = false
}: TodaysTaskCardProps) => {
  const addCoins = useCoinsStore((s) => s.addCoins)

  const toggleCompleteMutation = useMutation({
    mutationFn: async (params: { task: TodaysTask; nextChecked: boolean }) => {
      const { task, nextChecked } = params
      if (nextChecked === task.isComplete) return

      if (nextChecked) {
        const now = new Date()
        const nextEarned = (task.earnedCoins ?? 0) + coinsPerTask

        const { error } = await updateTaskProgress(task.id, {
          isComplete: true,
          completedAt: now,
          earnedCoins: nextEarned
        })
        if (error) throw error

        addCoins(coinsPerTask)
        onCoinsEarned?.(coinsPerTask)
      } else {
        const { error } = await updateTaskProgress(task.id, {
          isComplete: false,
          completedAt: null,
          earnedCoins: 0 // keep for now; you can decide later
        })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (err) => {
      console.error('TodaysTaskCard toggle failed:', err)
    }
  })
  return (
    <Card className="pt-5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Today&apos;s Tasks</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <AddTask />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="gap-2 flex flex-col">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 bg-primary-background p-4 rounded-lg">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-muted-foreground">No tasks for today!</p>
        ) : (
          <div className="space-y-6">
            {(() => {
              // Show tasks due today only (exclude habits)
              const isDueToday = (d?: Date | string | null) => {
                if (!d) return false
                const todayKey = toDateOnlyString(new Date())
                const dueKey =
                  d instanceof Date
                    ? toDateOnlyString(d)
                    : typeof d === 'string'
                      ? toDateOnlyString(parseDateOnly(d) ?? new Date(d))
                      : null
                return dueKey === todayKey
              }

              const dueToday = tasks.filter((t) => t.type !== 'habit' && isDueToday(t.dueDate))
              const highToday = dueToday.filter((t) => t.priority === 'high')

              return highToday.length > 0 ? (
                <section aria-label="High Priority Tasks" className="gap-3 flex flex-col">
                  <div className="text-xl font-bold mb-2">High Priority Tasks</div>
                  <ul className="gap-2 flex flex-col p-1">
                    {highToday.map((task) => (
                      <li
                        key={task.id}
                        className="flex items-center gap-3 space-x-3 bg-[#f5d7d7] p-2 rounded-lg"
                      >
                        <Checkbox
                          checked={task.isComplete}
                          disabled={toggleCompleteMutation.isPending}
                          onCheckedChange={(checked) =>
                            toggleCompleteMutation.mutate({ task, nextChecked: checked === true })
                          }
                          aria-label={`Mark ${task.title} complete`}
                        />
                        <span
                          className={task.isComplete ? 'line-through text-accent' : 'font-semibold'}
                        >
                          {task.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null
            })()}

            <section aria-label="Other Tasks" className="gap-3 flex flex-col">
              <div className="text-xl font-bold pt-2 overflow-y-auto">To do</div>
              <ul className="gap-2 flex flex-col p-1">
                {(() => {
                  const isDueToday = (d?: Date | string | null) => {
                    if (!d) return false
                    const todayKey = toDateOnlyString(new Date())
                    const dueKey =
                      d instanceof Date
                        ? toDateOnlyString(d)
                        : typeof d === 'string'
                          ? toDateOnlyString(parseDateOnly(d) ?? new Date(d))
                          : null
                    return dueKey === todayKey
                  }
                  const dueToday = tasks.filter((t) => t.type !== 'habit' && isDueToday(t.dueDate))
                  const highTodayIds = new Set(
                    dueToday.filter((t) => t.priority === 'high').map((t) => t.id)
                  )
                  return dueToday
                    .filter((t) => !highTodayIds.has(t.id))
                    .map((task) => (
                      <li key={task.id} className="flex items-center gap-2 p-2 rounded-lg">
                        <Checkbox
                          checked={task.isComplete}
                          disabled={toggleCompleteMutation.isPending}
                          onCheckedChange={(checked) =>
                            toggleCompleteMutation.mutate({ task, nextChecked: checked === true })
                          }
                          aria-label={`Mark ${task.title} complete`}
                        />
                        <span
                          className={task.isComplete ? 'line-through text-muted-foreground' : ''}
                        >
                          {task.title}
                        </span>
                      </li>
                    ))
                })()}
              </ul>
            </section>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
