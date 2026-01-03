import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ToggleModeBttn from '@/features/productivity/pomodoro/components/ToggleModeBttn'

describe('ToggleModeBttn', () => {
  it('shows label "stopwatch" when currentMode is pomodoro', () => {
    const onToggle = vi.fn()
    render(<ToggleModeBttn currentMode="pomodoro" onToggle={onToggle} />)
    expect(screen.getByRole('button', { name: /stopwatch/i })).toBeInTheDocument()
  })

  it('shows label "pomodoro" when currentMode is stopwatch', () => {
    const onToggle = vi.fn()
    render(<ToggleModeBttn currentMode="stopwatch" onToggle={onToggle} />)
    expect(screen.getByRole('button', { name: /pomodoro/i })).toBeInTheDocument()
  })

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn()
    render(<ToggleModeBttn currentMode="pomodoro" onToggle={onToggle} />)
    const button = screen.getByRole('button', { name: /stopwatch/i })
    fireEvent.click(button)
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
