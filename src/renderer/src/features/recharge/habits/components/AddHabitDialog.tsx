import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Target } from 'lucide-react'

const DAY_OPTIONS = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 }
]

const TIME_OPTIONS = [
  { label: 'Any time', value: '' },
  { label: 'Morning', value: 'morning' },
  { label: 'Afternoon', value: 'afternoon' },
  { label: 'Night', value: 'night' }
]

type AddHabitDialogProps = {
  title: string
  onTitleChange: (value: string) => void
  scheduleDays: number[]
  onToggleDay: (day: number) => void
  timeOfDay: '' | 'morning' | 'afternoon' | 'night'
  onTimeOfDayChange: (value: '' | 'morning' | 'afternoon' | 'night') => void
  onSubmit: () => void
  isSubmitting?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const AddHabitDialog = ({
  title,
  onTitleChange,
  scheduleDays,
  onToggleDay,
  timeOfDay,
  onTimeOfDayChange,
  onSubmit,
  isSubmitting = false,
  open,
  onOpenChange
}: AddHabitDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-alt/15 text-primary-alt">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">Habit Tracker</div>
            <p className="text-sm text-muted-foreground">
              Track your daily habits and build streaks.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-primary/10 bg-white/90 p-3 shadow-sm">
          <div className="flex gap-2">
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="New habit"
            />
            <Button onClick={onSubmit} disabled={isSubmitting || title.trim().length === 0}>
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-primary">Schedule days</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {DAY_OPTIONS.map((day) => {
                const active = scheduleDays.includes(day.value)
                return (
                  <Button
                    key={day.value}
                    type="button"
                    onClick={() => onToggleDay(day.value)}
                    className={`h-8 min-w-10 rounded-lg border text-xs font-semibold transition ${
                      active
                        ? 'border-primary-alt bg-primary-alt text-white'
                        : 'border-primary/20 bg-white text-primary'
                    }`}
                    aria-pressed={active}
                  >
                    {day.label}
                  </Button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-primary">Time of day</p>
            <select
              value={timeOfDay}
              onChange={(e) =>
                onTimeOfDayChange(e.target.value as '' | 'morning' | 'afternoon' | 'night')
              }
              className="mt-2 h-9 w-full rounded-md border border-primary/20 bg-white px-3 text-sm text-primary"
            >
              {TIME_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
