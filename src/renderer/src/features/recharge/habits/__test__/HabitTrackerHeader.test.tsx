import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HabitTrackerHeader } from '../components/HabitTrackerHeader'

describe('HabitTrackerHeader', () => {
  it('renders the default title', () => {
    render(<HabitTrackerHeader />)
    expect(screen.getByText('Habit Tracker')).toBeInTheDocument()
  })

  it('renders a custom title and action', () => {
    render(<HabitTrackerHeader title="My Habits" action={<button>Action</button>} />)
    expect(screen.getByText('My Habits')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })
})
