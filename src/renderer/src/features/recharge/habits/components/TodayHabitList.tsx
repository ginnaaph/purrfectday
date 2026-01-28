import type { Task } from '@/features/productivity/tasks/types'
import { Checkbox } from '@/components/checkbox/ui/checkbox'
import { Skeleton } from '@/components/side-bar/components/ui/skeleton'

type TodayHabitListProps = {
  habits: Task[]
  isLoading?: boolean
  isCompleted: (taskId: number) => boolean
  onToggle: (taskId: number, nextChecked: boolean) => void
  isToggling?: boolean
}

export const TodayHabitList = ({
  habits,
  isLoading = false,
  isCompleted,
  onToggle,
  isToggling = false
}: TodayHabitListProps) => {
  if (isLoading) {
    return (
      <div className="gap-2 flex flex-col">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 bg-primary-background p-4 rounded-lg">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    )
  }

  if (habits.length === 0) {
    return <p className="text-muted-foreground">No habits for today.</p>
  }

  return (
    <ul className="space-y-2 flex  gap-2 flex-col justify-between">
      {habits.map((habit) => {
        const completed = isCompleted(habit.id)
        return (
          <li
            key={habit.id}
            className="flex  items-center gap-2 space-y-2 rounded-lg bg-secondary-background p-2"
          >
            <Checkbox
              checked={completed}
              disabled={isToggling}
              onCheckedChange={(checked) => onToggle(habit.id, checked === true)}
              aria-label={`Mark ${habit.title} complete`}
            />
            <div className="flex flex-col ml-2">
              <span className={completed ? 'line-through text-primary/60' : ''}>{habit.title}</span>
              {habit.timeOfDay && (
                <span className="text-xs text-primary/60 capitalize">{habit.timeOfDay}</span>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
