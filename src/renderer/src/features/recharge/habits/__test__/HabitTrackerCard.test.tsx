import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import type { Task } from '@/features/productivity/tasks/types'
import { HabitTrackerCard } from '../components/HabitTrackerCard'
import { queryClient } from '@/libs/QueryClient'
import { toLocalDateKey } from '@/features/recharge/habits/utils/dateUtils'
import { createHabitTask } from '@/features/recharge/habits/api/createHabitTask'
import { useHabits } from '@/features/recharge/habits/hooks/useHabits'
import { useHabitLogs } from '@/features/recharge/habits/hooks/useHabitLogs'
import { useToggleHabitCompletion } from '@/features/recharge/habits/hooks/useToggleHabitCompletion'

vi.mock('@/features/recharge/habits/api/createHabitTask', () => ({
  createHabitTask: vi.fn()
}))

vi.mock('@/features/recharge/habits/hooks/useHabits', () => ({
  useHabits: vi.fn()
}))

vi.mock('@/features/recharge/habits/hooks/useHabitLogs', () => ({
  useHabitLogs: vi.fn()
}))

vi.mock('@/features/recharge/habits/hooks/useToggleHabitCompletion', () => ({
  useToggleHabitCompletion: vi.fn()
}))

const renderWithProviders = (ui: React.ReactElement) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)

describe('HabitTrackerCard', () => {
  const today = new Date()
  const todayKey = toLocalDateKey(today)
  const todayDay = today.getDay()

  const habit: Task = {
    id: 1,
    title: 'Meditate',
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
    scheduleDays: [todayDay],
    timeOfDay: 'morning'
  }

  beforeEach(() => {
    queryClient.clear()
    vi.clearAllMocks()

    vi.mocked(useHabits).mockReturnValue({
      habits: [habit],
      isLoading: false,
      error: null
    })

    vi.mocked(useHabitLogs).mockReturnValue({
      isCompleted: () => false,
      isLoading: false
    })

    vi.mocked(useToggleHabitCompletion).mockReturnValue({
      mutate: vi.fn(),
      isPending: false
    })
  })

  it('renders today habits', () => {
    renderWithProviders(<HabitTrackerCard />)
    expect(screen.getByText('Meditate')).toBeInTheDocument()
    expect(screen.getByText('morning')).toBeInTheDocument()
  })

  it('toggles habit completion from today list', async () => {
    const toggleSpy = vi.fn()
    vi.mocked(useToggleHabitCompletion).mockReturnValue({
      mutate: toggleSpy,
      isPending: false
    })

    renderWithProviders(<HabitTrackerCard />)
    const checkbox = screen.getByLabelText(/mark meditate complete/i)
    await userEvent.click(checkbox)

    expect(toggleSpy).toHaveBeenCalledWith({
      taskId: 1,
      logDate: todayKey,
      nextStatus: 'completed'
    })
  })

  it('creates a habit from the dialog', async () => {
    vi.mocked(createHabitTask).mockResolvedValue({ data: habit, error: null })

    renderWithProviders(<HabitTrackerCard />)

    await userEvent.click(screen.getByRole('button', { name: /add habit/i }))
    const input = await screen.findByPlaceholderText('New habit')
    await userEvent.clear(input)
    await userEvent.type(input, 'Read')

    await userEvent.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => {
      expect(createHabitTask).toHaveBeenCalledTimes(1)
    })

    expect(createHabitTask).toHaveBeenCalledWith({
      title: 'Read',
      scheduleDays: null,
      timeOfDay: null
    })
  })
})
