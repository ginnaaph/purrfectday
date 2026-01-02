import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { TaskDetails } from '../TaskDetails'
import { useTaskModalStore } from '../../store/useTaskModalStore'

// Mock the data hook used inside TaskDetails
const mutateSpy = vi.fn()
vi.mock('../../hooks/useTaskDetailData', () => {
  const fakeTask = {
    id: 101,
    title: 'Write cat blog',
    description: 'Draft the blog about cats',
    dueDate: new Date('2026-01-10'),
    priority: 'medium' as const,
    estimatedPomodoros: 2,
    isComplete: false,
    tags: ['writing', 'cats'],
    earnedCoins: 0
  }
  return {
    useTaskDetailData: () => ({
      task: fakeTask,
      updateTaskMutation: { mutate: mutateSpy, isPending: false }
    })
  }
})

describe('TaskDetails dialog', () => {
  beforeEach(() => {
    mutateSpy.mockClear()
    // Ensure the modal is open with the task id
    useTaskModalStore.getState().open(101)
  })

  it('renders initial task values and submits updates', async () => {
    render(<TaskDetails taskId={101} />)

    // Title field populated
    const titleInput = await screen.findByLabelText('Title')
    expect((titleInput as HTMLInputElement).value).toBe('Write cat blog')

    // Description field populated
    const descInput = screen.getByLabelText('Description') as HTMLTextAreaElement
    expect(descInput.value).toBe('Draft the blog about cats')

    // Due date populated
    const dateInput = screen.getByLabelText('Due Date') as HTMLInputElement
    expect(dateInput.value).toBe('2026-01-10')

    // Priority select populated
    const prioritySelect = screen.getByLabelText('Priority') as HTMLSelectElement
    expect(prioritySelect.value).toBe('medium')

    // Tags populated as comma-separated
    const tagsInput = screen.getByLabelText('Tags (comma-separated)') as HTMLInputElement
    expect(tagsInput.value).toBe('writing, cats')

    // Make some edits
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Updated blog title')

    await userEvent.selectOptions(prioritySelect, 'high')

    await userEvent.clear(tagsInput)
    await userEvent.type(tagsInput, 'work, urgent')

    // Click Save
    const saveButton = screen.getByRole('button', { name: /save/i })
    await userEvent.click(saveButton)

    // Assert that mutate was called with expected payload
    expect(mutateSpy).toHaveBeenCalledTimes(1)
    const arg = mutateSpy.mock.calls[0][0]
    expect(arg.taskId).toBe(101)
    expect(arg.updates).toMatchObject({
      title: 'Updated blog title',
      description: 'Draft the blog about cats',
      priority: 'high',
      tags: 'work, urgent',
      estimated_pomodoros: 2,
      dueDate: new Date('2026-01-10')
    })
  })
})
