import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddHabitDialog } from '../components/AddHabitDialog'

describe('AddHabitDialog', () => {
  it('disables add button when title is empty', () => {
    render(
      <AddHabitDialog
        title=""
        onTitleChange={() => undefined}
        scheduleDays={[]}
        onToggleDay={() => undefined}
        timeOfDay=""
        onTimeOfDayChange={() => undefined}
        onSubmit={() => undefined}
        open
      />
    )

    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled()
  })

  it('calls onSubmit when add is clicked', async () => {
    const onSubmit = vi.fn()
    render(
      <AddHabitDialog
        title="Walk dog"
        onTitleChange={() => undefined}
        scheduleDays={[]}
        onToggleDay={() => undefined}
        timeOfDay=""
        onTimeOfDayChange={() => undefined}
        onSubmit={onSubmit}
        open
      />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('emits schedule day and time selection changes', () => {
    const onToggleDay = vi.fn()
    const onTimeOfDayChange = vi.fn()

    render(
      <AddHabitDialog
        title="Stretch"
        onTitleChange={() => undefined}
        scheduleDays={[]}
        onToggleDay={onToggleDay}
        timeOfDay=""
        onTimeOfDayChange={onTimeOfDayChange}
        onSubmit={() => undefined}
        open
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Mon' }))
    expect(onToggleDay).toHaveBeenCalledWith(1)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'morning' } })
    expect(onTimeOfDayChange).toHaveBeenCalledWith('morning')
  })
})
