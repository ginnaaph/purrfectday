import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { Task } from '@/features/productivity/tasks/types'
import { WeeklyHabitGrid } from '../components/WeeklyHabitGrid'

describe('WeeklyHabitGrid', () => {
  const weekStart = new Date(2024, 0, 7)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  const habits: Task[] = [
    {
      id: 1,
      title: 'Stretch',
      description: undefined,
      dueDate: null,
      project_id: null,
      priority: null,
      estimatedPomodoros: 0,
      pomodorosCompleted: 0,
      isComplete: false,
      completedAt: null,
      tags: [],
      earnedCoins: 0,
      type: 'habit',
      scheduleDays: [],
      timeOfDay: null
    }
  ]

  it('renders week labels and dates', () => {
    render(
      <WeeklyHabitGrid
        weekDays={weekDays}
        habits={habits}
        isCompleted={() => false}
      />
    )

    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('This Week')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('uses completed styling and navigates weeks', () => {
    const onPrevWeek = vi.fn()
    const onNextWeek = vi.fn()

    render(
      <WeeklyHabitGrid
        weekDays={weekDays}
        habits={habits}
        isCompleted={(taskId, date) =>
          taskId === 1 && date.toDateString() === weekDays[2].toDateString()
        }
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
      />
    )

    const completedCell = screen.getByText(String(weekDays[2].getDate()))
    expect(completedCell).toHaveClass('bg-primary')

    fireEvent.click(screen.getByLabelText('Previous week'))
    fireEvent.click(screen.getByLabelText('Next week'))

    expect(onPrevWeek).toHaveBeenCalledTimes(1)
    expect(onNextWeek).toHaveBeenCalledTimes(1)
  })
})
