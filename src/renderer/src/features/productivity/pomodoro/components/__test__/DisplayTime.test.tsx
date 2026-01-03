import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DisplayTime from '@/features/productivity/pomodoro/components/DisplayTime'

// The component uses formatTime: minutes without pad + seconds padded to 2 digits
// e.g. 125 -> "2:05"

describe('DisplayTime', () => {
  it('renders 0 seconds as 0:00', () => {
    render(<DisplayTime seconds={0} />)
    expect(screen.getByText('0:00')).toBeInTheDocument()
  })

  it('renders seconds under a minute correctly', () => {
    render(<DisplayTime seconds={59} />)
    expect(screen.getByText('0:59')).toBeInTheDocument()
  })

  it('renders exact minutes correctly', () => {
    render(<DisplayTime seconds={60} />)
    expect(screen.getByText('1:00')).toBeInTheDocument()
  })

  it('pads seconds to two digits', () => {
    render(<DisplayTime seconds={125} />)
    expect(screen.getByText('2:05')).toBeInTheDocument()
  })
})
