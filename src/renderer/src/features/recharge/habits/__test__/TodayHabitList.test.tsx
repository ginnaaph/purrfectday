import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { Task } from '@/features/productivity/tasks/types'
import { TodayHabitList } from '../components/TodayHabitList'

describe('TodayHabitList', () => {
  const baseHabit: Task = {
    id: 1,
    title: 'Drink water',
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
    scheduleDays: [1],
    timeOfDay: 'morning'
  }

  it('shows an empty message when no habits', () => {
    render(
      <TodayHabitList
        habits={[]}
        isCompleted={() => false}
        onToggle={() => undefined}
      />
    )
    expect(screen.getByText('No habits for today.')).toBeInTheDocument()
  })

  it('renders habit title and time of day', () => {
    render(
      <TodayHabitList
        habits={[baseHabit]}
        isCompleted={() => false}
        onToggle={() => undefined}
      />
    )

    expect(screen.getByText('Drink water')).toBeInTheDocument()
    expect(screen.getByText('morning')).toBeInTheDocument()
  })

  it('marks completed habit with line-through and calls toggle', () => {
    const onToggle = vi.fn()
    render(
      <TodayHabitList
        habits={[baseHabit]}
        isCompleted={() => true}
        onToggle={onToggle}
      />
    )

    expect(screen.getByText('Drink water')).toHaveClass('line-through')
    const checkbox = screen.getByLabelText(/mark drink water complete/i)
    fireEvent.click(checkbox)
    expect(onToggle).toHaveBeenCalledWith(1, true)
  })
})
