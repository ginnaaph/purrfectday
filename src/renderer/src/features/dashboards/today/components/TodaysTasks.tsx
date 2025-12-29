import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/libs/QueryClient'
import { updateTaskProgress } from '@/features/productivity/tasks/api/updateTaskProgress'
import { useCoinsStore } from '@/features/shop/coins/store/useCoinStore'
import { Card, CardContent, CardHeader } from '@/components/card/ui/card'
import { Skeleton } from '@/components/side-bar/components/ui/skeleton'
import { Checkbox } from '@/components/checkbox/ui/checkbox'
import { Button } from '@/components/side-bar/components/ui/button'
import { AddTask } from '@/features/productivity/tasks/components/AddTask'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/dialog/ui/dialog'

type TodaysTask = {
  id: number
  title: string
  isComplete: boolean
  completedAt?: Date | null
  earnedCoins?: number
  priority?: 'low' | 'medium' | 'high' | null
}

type TodaysTaskCardProps = {
  tasks: {
    id: number
    title: string
    isComplete: boolean
    completedAt?: Date | null
    priority?: 'low' | 'medium' | 'high' | null
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-heading">Today</h2>
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
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 bg-lightbeige p-2 rounded-lg">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-muted-foreground">No tasks for today!</p>
        ) : (
          <div className="space-y-6">
            {tasks.filter((t) => t.priority === 'high' && !t.isComplete).length > 0 && (
              <section aria-label="High Priority Tasks">
                <div className="text-lg font-semibold  mb-2">High Priority</div>
                <ul className="space-y-2">
                  {tasks
                    .filter((t) => t.priority === 'high' && !t.isComplete)
                    .map((task) => (
                      <li
                        key={task.id}
                        className="flex items-center gap-3 bg-[#f5d7d7] p-2 rounded-lg"
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
                          className={
                            task.isComplete ? 'line-through text-muted-foreground' : 'font-semibold'
                          }
                        >
                          {task.title}
                        </span>
                      </li>
                    ))}
                </ul>
              </section>
            )}

            <section aria-label="Other Tasks">
              <ul className="space-y-2">
                {tasks
                  .filter((t) => !(t.priority === 'high' && !t.isComplete))
                  .map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center gap-3 bg-lightbeige p-2 rounded-lg"
                    >
                      <Checkbox
                        checked={task.isComplete}
                        disabled={toggleCompleteMutation.isPending}
                        onCheckedChange={(checked) =>
                          toggleCompleteMutation.mutate({ task, nextChecked: checked === true })
                        }
                        aria-label={`Mark ${task.title} complete`}
                      />
                      <span className={task.isComplete ? 'line-through text-muted-foreground' : ''}>
                        {task.title}
                      </span>
                    </li>
                  ))}
              </ul>
            </section>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
