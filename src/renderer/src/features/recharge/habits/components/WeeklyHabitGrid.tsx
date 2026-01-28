import type { Task } from '@/features/productivity/tasks/types'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type WeeklyHabitGridProps = {
  weekDays: Date[]
  habits: Task[]
  isCompleted: (taskId: number, date: Date) => boolean
  onPrevWeek?: () => void
  onNextWeek?: () => void
}

export const WeeklyHabitGrid = ({
  weekDays,
  habits,
  isCompleted,
  onPrevWeek,
  onNextWeek
}: WeeklyHabitGridProps) => {
  return (
    <div className=" flex  flex-col space-y-2 mt-5 gap-2">
      <div className="flex items-center justify-between text-sm text-primary/70 mt-3" >
        <button type="button" onClick={onPrevWeek} className="p-1" aria-label="Previous week">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 font-semibold text-primary mt-3">
          <Calendar className="h-4 w-4" />
          This Week
        </div>
        <button type="button" onClick={onNextWeek} className="p-1" aria-label="Next week">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col mt-5">
        <div className="grid grid-cols-7  gap-2 text-center text-xs text-primary/70 mt-5">
          {weekDays.map((day, index) => {
            const completed = habits.some((habit) => isCompleted(habit.id, day))
            return (
              <div key={day.toISOString()} className="space-y-2">
                <div>{WEEKDAY_LABELS[index]}</div>
                <div
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-xl text-sm font-semibold ${
                    completed ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
