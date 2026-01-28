import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HabitStatsRow } from '../components/HabitStatsRow'

describe('HabitStatsRow', () => {
  it('shows streak, best, and rate', () => {
    render(<HabitStatsRow completedToday={3} totalToday={6} />)
    expect(screen.getByText('3 streak')).toBeInTheDocument()
    expect(screen.getByText('6 best')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('shows 0% rate when total is zero', () => {
    render(<HabitStatsRow completedToday={0} totalToday={0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})
