import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GoalsView } from '../GoalsView'
import type { Goal } from '../../types'

vi.mock('../GoalTaskDialog', () => ({
  GoalTaskDialog: ({ open, onSubmit }: { open: boolean; onSubmit: (values: any) => void }) =>
    open ? (
      <button type="button" onClick={() => onSubmit({ title: 'New task', project: null })}>
        Submit task
      </button>
    ) : null
}))

const goals: Goal[] = [
  {
    id: 1,
    title: 'Ship Purrfect Day',
    description: 'Launch the desktop app',
    deadline: '2026-02-01',
    tasks: [
      { id: 's1', title: 'Daily build', isDone: true },
      { id: 's2', title: 'Weekly roadmap review', isDone: false }
    ]
  }
]

describe('GoalsView', () => {
  it('renders goal content and progress', () => {
    render(
      <GoalsView
        goals={goals}
        newGoalTitle=""
        newGoalDescription=""
        newGoalDeadline=""
        saveError={null}
        isCreateOpen={false}
        openTaskGoalId={null}
        isSavingTask={false}
        onGoalTitleChange={vi.fn()}
        onGoalDescriptionChange={vi.fn()}
        onGoalDeadlineChange={vi.fn()}
        onAddGoal={vi.fn()}
        onOpenCreate={vi.fn()}
        onCloseCreate={vi.fn()}
        onToggleTask={vi.fn()}
        onOpenTaskDialog={vi.fn()}
        onCloseTaskDialog={vi.fn()}
        onAddTask={vi.fn()}
      />
    )

    expect(screen.getByText('Ship Purrfect Day')).toBeInTheDocument()
    expect(screen.getByText('Launch the desktop app')).toBeInTheDocument()
    expect(screen.getByText('1/2 completed')).toBeInTheDocument()
  })

  it('calls handlers for toggle and add system', () => {
    const onToggleSystem = vi.fn()
    const onAddSystem = vi.fn()

    render(
      <GoalsView
        goals={goals}
        newGoalTitle=""
        newGoalDescription=""
        newGoalDeadline=""
        isCreateOpen={false}
        openTaskGoalId={1}
        saveError={null}
        isSavingTask={false}
        onGoalTitleChange={vi.fn()}
        onGoalDescriptionChange={vi.fn()}
        onGoalDeadlineChange={vi.fn()}
        onOpenCreate={vi.fn()}
        onCloseCreate={vi.fn()}
        onAddGoal={vi.fn()}
        onToggleTask={onToggleSystem}
        onOpenTaskDialog={vi.fn()}
        onCloseTaskDialog={vi.fn()}
        onAddTask={onAddSystem}
      />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    expect(onToggleSystem).toHaveBeenCalledWith(1, 's1')

    fireEvent.click(screen.getByRole('button', { name: /submit task/i }))
    expect(onAddSystem).toHaveBeenCalledWith(1, { title: 'New task', project: null })
  })

  it('shows an error message when provided', () => {
    render(
      <GoalsView
        goals={goals}
        newGoalTitle=""
        newGoalDescription=""
        newGoalDeadline=""
        saveError="Network failed"
        isCreateOpen={false}
        openTaskGoalId={null}
        isSavingTask={false}
        onGoalTitleChange={vi.fn()}
        onGoalDescriptionChange={vi.fn()}
        onGoalDeadlineChange={vi.fn()}
        onOpenCreate={vi.fn()}
        onCloseCreate={vi.fn()}
        onAddGoal={vi.fn()}
        onToggleTask={vi.fn()}
        onOpenTaskDialog={vi.fn()}
        onCloseTaskDialog={vi.fn()}
        onAddTask={vi.fn()}
      />
    )

    expect(screen.getByText(/Network failed/i)).toBeInTheDocument()
  })
})
