import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader } from '@/components/card/ui/card'
import { HabitTrackerHeader } from '@/features/recharge/habits/components/HabitTrackerHeader'
import { AddHabitDialog } from '@/features/recharge/habits/components/AddHabitDialog'
import { TodayHabitList } from '@/features/recharge/habits/components/TodayHabitList'
// import { WeeklyHabitGrid } from '@/features/recharge/habits/components/WeeklyHabitGrid'
import { HabitStatsRow } from '@/features/recharge/habits/components/HabitStatsRow'
import { useHabits } from '@/features/recharge/habits/hooks/useHabits'
import { useHabitLogs } from '@/features/recharge/habits/hooks/useHabitLogs'
import { useToggleHabitCompletion } from '@/features/recharge/habits/hooks/useToggleHabitCompletion'
import { createHabitTask } from '@/features/recharge/habits/api/createHabitTask'
import { queryClient } from '@/libs/QueryClient'
import {
  getWeekDays,
  isHabitScheduledForDate,
  toLocalDateKey
} from '@/features/recharge/habits/utils/dateUtils'
import type { HabitTaskInput } from '@/features/recharge/habits/types'

export const HabitTrackerCard = () => {
  const { habits, isLoading: habitsLoading } = useHabits()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newHabitTitle, setNewHabitTitle] = useState('')
  const [scheduleDays, setScheduleDays] = useState<number[]>([])
  const [timeOfDay, setTimeOfDay] = useState<'' | 'morning' | 'afternoon' | 'night'>('')
  const [weekOffset, setWeekOffset] = useState(0)

  const baseWeekDate = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + weekOffset * 7)
    return date
  }, [weekOffset])

  const weekDays = useMemo(() => getWeekDays(baseWeekDate), [baseWeekDate])
  const { isCompleted, isLoading: logsLoading } = useHabitLogs(weekDays)
  const toggleCompletion = useToggleHabitCompletion()

  const today = new Date()
  const todayKey = toLocalDateKey(today)
  const todaysHabits = habits.filter((habit) => isHabitScheduledForDate(habit.scheduleDays, today))
  const completedToday = todaysHabits.filter((habit) => isCompleted(habit.id, today)).length

  const createHabitMutation = useMutation({
    mutationFn: (input: HabitTaskInput) => createHabitTask(input),
    onSuccess: (result) => {
      if (result?.data) {
        queryClient.setQueryData(['habit_tasks'], (old) => {
          if (!old || typeof old !== 'object') return old
          const current = (old as { data?: (typeof result.data)[] }).data ?? []
          return { ...(old as object), data: [result.data, ...current] }
        })
      }
      queryClient.invalidateQueries({ queryKey: ['habit_tasks'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setNewHabitTitle('')
      setScheduleDays([])
      setTimeOfDay('')
      setDialogOpen(false)
    },
    onError: (error) => {
      console.error('Habit creation failed:', error)
    }
  })

  const handleToggleDay = (day: number) => {
    setScheduleDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const handleCreateHabit = () => {
    const trimmed = newHabitTitle.trim()
    if (!trimmed) return
    createHabitMutation.mutate({
      title: trimmed,
      scheduleDays: scheduleDays.length ? scheduleDays : null,
      timeOfDay: timeOfDay || null
    })
  }

  const handleToggleHabit = (taskId: number, nextChecked: boolean) => {
    toggleCompletion.mutate({
      taskId,
      logDate: todayKey,
      nextStatus: nextChecked ? 'completed' : 'missed'
    })
  }

  return (
    <Card className=" flex flex-col pt-1">
      <CardHeader>
        <HabitTrackerHeader
          action={
            <AddHabitDialog
              title={newHabitTitle}
              onTitleChange={setNewHabitTitle}
              scheduleDays={scheduleDays}
              onToggleDay={handleToggleDay}
              timeOfDay={timeOfDay}
              onTimeOfDayChange={setTimeOfDay}
              onSubmit={handleCreateHabit}
              isSubmitting={createHabitMutation.isPending}
              open={dialogOpen}
              onOpenChange={setDialogOpen}
            />
          }
        />
      </CardHeader> 
      <CardContent className="space-y-2 gap-5 flex flex-col">
        <HabitStatsRow completedToday={completedToday} totalToday={todaysHabits.length} />

        <TodayHabitList
          habits={todaysHabits}
          isLoading={habitsLoading}
          isCompleted={(taskId) => isCompleted(taskId, today)}
          onToggle={handleToggleHabit}
          isToggling={toggleCompletion.isPending || logsLoading}
        />
        {/* <WeeklyHabitGrid
          weekDays={weekDays}
          habits={habits}
          isCompleted={isCompleted}
          onPrevWeek={() => setWeekOffset((prev) => prev - 1)}
          onNextWeek={() => setWeekOffset((prev) => prev + 1)}
        /> */}
      </CardContent>
    </Card>
  )
}
