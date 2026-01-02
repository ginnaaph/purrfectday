import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskList } from '../TaskList'

// Stub TaskItem to simplify list behavior tests
vi.mock('../TaskItem', () => ({
  TaskItem: ({ task }: any) => <div data-testid={`task-item-${task.id}`}>{task.title}</div>
}))

// Stub TaskDetails to avoid React Query usage inside the list
vi.mock('../TaskDetails', () => ({
  TaskDetails: () => null
}))

const makeTask = (id: number, overrides: Partial<any> = {}) => ({
  id,
  title: `Task ${id}`,
  isComplete: false,
  earnedCoins: 0,
  dueDate: null,
  priority: null,
  ...overrides
})

describe('TaskList', () => {
  it('renders incomplete tasks in the list', () => {
    const tasks = [makeTask(1), makeTask(2), makeTask(3, { isComplete: true })]
    render(<TaskList tasks={tasks} />)
    expect(screen.getByTestId('task-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('task-item-2')).toBeInTheDocument()
    expect(screen.queryByTestId('task-item-3')).not.toBeInTheDocument()
  })

  it('shows empty state when no incomplete tasks', () => {
    const tasks = [makeTask(10, { isComplete: true }), makeTask(11, { isComplete: true })]
    render(<TaskList tasks={tasks} />)
    expect(screen.getByText('You are all caught up! 🐾')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /No tasks/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Show Completed \(2\)/i })).toBeInTheDocument()
  })

  it('toggles completed tasks visibility in empty state', () => {
    const tasks = [makeTask(21, { isComplete: true }), makeTask(22, { isComplete: true })]
    render(<TaskList tasks={tasks} />)

    const toggle = screen.getByRole('button', { name: /Show Completed \(2\)/i })
    fireEvent.click(toggle)

    expect(screen.getByTestId('task-item-21')).toBeInTheDocument()
    expect(screen.getByTestId('task-item-22')).toBeInTheDocument()

    // Now button should read Hide Completed (2)
    expect(screen.getByRole('button', { name: /Hide Completed \(2\)/i })).toBeInTheDocument()
  })

  it('lists completed section with toggling when incomplete tasks exist', () => {
    const tasks = [makeTask(1), makeTask(2, { isComplete: true }), makeTask(3, { isComplete: true })]
    render(<TaskList tasks={tasks} />)

    const toggle = screen.getByRole('button', { name: /Show Completed \(2\)/i })
    fireEvent.click(toggle)

    expect(screen.getByTestId('task-item-2')).toBeInTheDocument()
    expect(screen.getByTestId('task-item-3')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Hide Completed \(2\)/i }))
    expect(screen.queryByTestId('task-item-2')).not.toBeInTheDocument()
    expect(screen.queryByTestId('task-item-3')).not.toBeInTheDocument()
  })
})
