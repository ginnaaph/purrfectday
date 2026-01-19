import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getAllProjects } from '@/features/productivity/projects/api/getAllProjects.api'

import { TaskList } from '../TaskList'

// Mock the data hook used by TaskDetails so we avoid Supabase/React Query inside the component
const mutateSpy = vi.fn()
vi.mock('../../hooks/useTaskDetailData', () => {
  const fakeTask = {
    id: 101,
    title: 'Write integrations',
    description: 'Ensure dialog opens from list',
    dueDate: new Date('2026-01-12'),
    priority: 'low' as const,
    estimatedPomodoros: 1,
    isComplete: false,
    tags: ['test'],
    earnedCoins: 0
  }
  return {
    useTaskDetailData: () => ({
      task: fakeTask,
      updateTaskMutation: { mutate: mutateSpy, isPending: false }
    })
  }
})

vi.mock('@/features/productivity/projects/api/getAllProjects.api', () => ({
  getAllProjects: vi.fn()
}))

describe('TaskList + TaskDetails integration', () => {
  it('opens dialog on title click and submits updates', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    })
    vi.mocked(getAllProjects).mockResolvedValue([])
    const tasks = [
      {
        id: 101,
        title: 'Write integrations',
        isComplete: false,
        earnedCoins: 0,
        dueDate: null,
        priority: 'low' as const
      }
    ]

    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <TaskList tasks={tasks} />
        </QueryClientProvider>
      </MemoryRouter>
    )

    // Click the task title button rendered by TaskItem
    const titleButton = screen.getByRole('button', { name: /write integrations/i })
    await userEvent.click(titleButton)

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edit/i })
    await userEvent.click(editButton)

    // The Title input should be prefilled with the task title from the mocked hook
    const titleInput = await screen.findByLabelText('Title')
    expect((titleInput as HTMLInputElement).value).toBe('Write integrations')

    // Make a change and save
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Updated integration title')

    const saveButton = screen.getByRole('button', { name: /save/i })
    await userEvent.click(saveButton)

    // Assert mutation was called
    expect(mutateSpy).toHaveBeenCalledTimes(1)
    const arg = mutateSpy.mock.calls[0][0]
    expect(arg.taskId).toBe(101)
    expect(arg.updates).toMatchObject({ title: 'Updated integration title' })
  })
})
