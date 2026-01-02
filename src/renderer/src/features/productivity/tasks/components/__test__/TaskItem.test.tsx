import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/libs/QueryClient'
import { TaskItem } from '../TaskItem'

// Mock stores and router
vi.mock('../../store/useTaskModalStore', () => {
  const open = vi.fn()
  return {
    useTaskModalStore: (sel: any) =>
      sel({ isOpen: false, selectedTaskId: null, open, close: vi.fn() }),
    __mocks: { open }
  }
})

vi.mock('../../store/useFocusTaskStore', () => {
  const setFocusedTaskId = vi.fn()
  return {
    useFocusTaskStore: (sel: any) =>
      sel({ focusedTaskId: null, setFocusedTaskId, clearFocusedTask: vi.fn() }),
    __mocks: { setFocusedTaskId }
  }
})

vi.mock('@/features/shop/coins/store/useCoinStore', () => {
  const addCoins = vi.fn()
  return {
    useCoinsStore: (sel: any) =>
      sel({ coins: 0, addCoins, spendCoins: vi.fn(), setCoins: vi.fn(), resetCoins: vi.fn() }),
    __mocks: { addCoins }
  }
})

vi.mock('react-router-dom', async (orig) => {
  const actual = await (orig() as Promise<any>)
  const navigate = vi.fn()
  return { ...actual, useNavigate: () => navigate, __mocks: { navigate } }
})

// Mock with a specifier that resolves to the same module path used in assertions
vi.mock('../../api/updateTaskProgress', () => ({
  updateTaskProgress: vi.fn(async () => ({ error: null }))
}))

vi.mock('@/features/productivity/tasks/api/deleteTask', () => ({
  deleteTask: vi.fn(async () => ({ error: null }))
}))

const baseTask = {
  id: 1,
  title: 'Write unit tests',
  isComplete: false,
  earnedCoins: 0,
  dueDate: null,
  priority: 'high' as const
}

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('TaskItem', () => {
  beforeEach(() => {
    queryClient.clear()
    vi.clearAllMocks()
  })

  it('renders title and priority pill', () => {
    renderWithProviders(<TaskItem task={baseTask} />)
    expect(screen.getByText('Write unit tests')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('opens task modal when title is clicked', async () => {
    const mod = await import('../../store/useTaskModalStore')
    const openMock = (mod as any).__mocks.open

    renderWithProviders(<TaskItem task={baseTask} />)
    fireEvent.click(screen.getByRole('button', { name: /write unit tests/i }))
    expect(openMock).toHaveBeenCalledWith(1)
  })

  it('focuses task and navigates to pomodoro on focus button', async () => {
    const focusMod = await import('../../store/useFocusTaskStore')
    const routerMod = await import('react-router-dom')
    const setFocusedMock = (focusMod as any).__mocks.setFocusedTaskId
    const navigateMock = (routerMod as any).__mocks.navigate

    renderWithProviders(<TaskItem task={baseTask} />)
    fireEvent.click(screen.getByRole('button', { name: /focus on task/i }))
    expect(setFocusedMock).toHaveBeenCalledWith(1)
    expect(navigateMock).toHaveBeenCalledWith('/pomodoro', { state: { focusFromTaskList: true } })
  })

  it('deletes task when delete is clicked', async () => {
    const { deleteTask } = await import('@/features/productivity/tasks/api/deleteTask')
    renderWithProviders(<TaskItem task={baseTask} />)
    fireEvent.click(screen.getByTestId('delete-button'))
    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith(1)
    })
  })

  it('completes task: calls update, awards coins and callback', async () => {
    const { updateTaskProgress } = await import('../../api/updateTaskProgress')
    const coinMod = await import('@/features/shop/coins/store/useCoinStore')
    const addCoinsMock = (coinMod as any).__mocks.addCoins
    const onCoinEarned = vi.fn()

    renderWithProviders(<TaskItem task={{ ...baseTask }} onCoinEarned={onCoinEarned} />)

    const checkbox = screen.getByLabelText(/Mark Write unit tests complete/i)
    fireEvent.click(checkbox)

    await waitFor(() => {
      expect(updateTaskProgress).toHaveBeenCalled()
      expect(addCoinsMock).toHaveBeenCalledWith(1)
      expect(onCoinEarned).toHaveBeenCalledWith(1)
    })
  })

  it('un-completes task: calls update without awarding coins', async () => {
    const { updateTaskProgress } = await import('../../api/updateTaskProgress')
    const coinMod = await import('@/features/shop/coins/store/useCoinStore')
    const addCoinsMock = (coinMod as any).__mocks.addCoins

    renderWithProviders(<TaskItem task={{ ...baseTask, isComplete: true }} />)

    const checkbox = screen.getByLabelText(/Mark Write unit tests complete/i)
    fireEvent.click(checkbox)

    await waitFor(() => {
      expect(updateTaskProgress).toHaveBeenCalled()
      expect(addCoinsMock).not.toHaveBeenCalled()
    })
  })
})
