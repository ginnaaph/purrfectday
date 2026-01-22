import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card/ui/card'
import { Button } from '@/components/side-bar/components/ui/button'
import { Input } from '@/components/side-bar/components/ui/input'
import { Checkbox } from '@/components/checkbox/ui/checkbox'
import { Skeleton } from '@/components/side-bar/components/ui/skeleton'
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog/ui/dialog'
import { updateTaskProgress } from '@/features/productivity/tasks/api/updateTaskProgress'
import { createTask } from '@/features/productivity/tasks/api/createTask'
import { queryClient } from '@/libs/QueryClient'
import { isTaskForToday, isCompletedOnDay } from '@/features/dashboards/today/utils/isTaskForToday'
import type { Task } from '@/features/productivity/tasks/types'
import { Target, Flame, Trophy, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

type HabitTrackerCardProps = {
  tasks: Task[]
  isLoading?: boolean
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const getWeekDays = (now = new Date()) => {
  const start = new Date(now)
  const day = start.getDay()
  start.setDate(start.getDate() - day)
  start.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

const normalizeTags = (tags?: Task['tags']) => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  }
  return []
}

export const HabitTrackerCard = ({ tasks, isLoading = false }: HabitTrackerCardProps) => {
  const [newHabitTitle, setNewHabitTitle] = useState('')
  const habits = useMemo(
    () => tasks.filter((t) => normalizeTags(t.tags).some((tag) => tag.toLowerCase() === 'habits')),
    [tasks]
  )
  const todaysHabits = useMemo(() => habits.filter((t) => isTaskForToday(t)), [habits])
  const weekDays = useMemo(() => getWeekDays(new Date()), [])

  const completedToday = todaysHabits.filter((t) => t.isComplete).length
  const totalToday = todaysHabits.length
  const completionRate = totalToday ? Math.round((completedToday / totalToday) * 100) : 0

  const toggleCompleteMutation = useMutation({
    mutationFn: async (params: { task: Task; nextChecked: boolean }) => {
      const { task, nextChecked } = params
      if (nextChecked === task.isComplete) return
      const now = new Date()
      const { error } = await updateTaskProgress(task.id, {
        isComplete: nextChecked,
        completedAt: nextChecked ? now : null,
        earnedCoins: task.earnedCoins ?? 0
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (err) => {
      console.error('Habit toggle failed:', err)
    }
  })

  const createHabitMutation = useMutation({
    mutationFn: async (title: string) => {
      const payload: Partial<Task> = {
        title,
        isComplete: false,
        tags: ['habits']
      }
      const { error } = await createTask(payload)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setNewHabitTitle('')
    },
    onError: (err) => {
      console.error('Habit creation failed:', err)
    }
  })

  const handleCreateHabit = () => {
    const trimmed = newHabitTitle.trim()
    if (!trimmed) return
    createHabitMutation.mutate(trimmed)
  }

  return (
    <Card className="pt-5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Habit Tracker</CardTitle>
          <Dialog>
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
                    value={newHabitTitle}
                    onChange={(e) => setNewHabitTitle(e.target.value)}
                    placeholder="New habit"
                  />
                  <Button onClick={handleCreateHabit} disabled={createHabitMutation.isPending}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {todaysHabits.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-primary/20 bg-primary/5 p-4 text-sm text-primary/70">
                    No habits for today yet.
                  </div>
                ) : (
                  todaysHabits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between rounded-xl bg-primary/5 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={habit.isComplete}
                          disabled={toggleCompleteMutation.isPending}
                          onCheckedChange={(checked) =>
                            toggleCompleteMutation.mutate({
                              task: habit,
                              nextChecked: checked === true
                            })
                          }
                          aria-label={`Mark ${habit.title} complete`}
                        />
                        <span className={habit.isComplete ? 'line-through text-primary/60' : ''}>
                          {habit.title}
                        </span>
                      </div>
                      {habit.isComplete && (
                        <span className="text-xs font-semibold text-primary-alt">✓</span>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm text-primary/80">
                <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/5 px-2 py-2">
                  <Flame className="h-4 w-4" />
                  <span>{completedToday} streak</span>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/5 px-2 py-2">
                  <Trophy className="h-4 w-4" />
                  <span>{totalToday} best</span>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/5 px-2 py-2">
                  <span className="font-semibold">{completionRate}%</span>
                  <span>rate</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm text-primary/70">
                <ChevronLeft className="h-4 w-4" />
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <Calendar className="h-4 w-4" />
                  This Week
                </div>
                <ChevronRight className="h-4 w-4" />
              </div>

              <div className="mt-2 grid grid-cols-7 gap-2 text-center text-xs text-primary/70">
                {weekDays.map((day, index) => {
                  const completed = habits.some((habit) => isCompletedOnDay(habit, day))
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
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="gap-2 flex flex-col">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 bg-primary-background p-4 rounded-lg">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        ) : todaysHabits.length === 0 ? (
          <p className="text-muted-foreground">No habits for today.</p>
        ) : (
          <ul className="space-y-2">
            {todaysHabits.map((habit) => (
              <li key={habit.id} className="flex items-center gap-3 rounded-lg bg-primary/5 p-3">
                <Checkbox
                  checked={habit.isComplete}
                  disabled={toggleCompleteMutation.isPending}
                  onCheckedChange={(checked) =>
                    toggleCompleteMutation.mutate({ task: habit, nextChecked: checked === true })
                  }
                  aria-label={`Mark ${habit.title} complete`}
                />
                <span className={habit.isComplete ? 'line-through text-primary/60' : ''}>
                  {habit.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
