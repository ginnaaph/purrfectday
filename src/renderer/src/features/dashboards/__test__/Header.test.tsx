import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.clearAllMocks()
  vi.resetModules()
})

describe('Header (integration - morning)', () => {
  it('renders Good Morning and correct date at 09:00 on Dec 24, 2025', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 11, 24, 9, 0, 0))

    const { Header } = await import('../components/Header')
    render(<Header />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Good Morning')
    expect(screen.getByText('Wednesday, December 24, 2025')).toBeInTheDocument()
  })
})

describe('Header (integration with real utils)', () => {
  it('renders correct greeting and date at a fixed system time', async () => {
    vi.useFakeTimers()
    // 9:00 AM on Dec 24, 2025
    vi.setSystemTime(new Date(2025, 11, 24, 9, 0, 0))

    // Ensure real modules (no mocks)
    vi.unmock('@/utils/getGreeting')
    vi.unmock('@/utils/dates/getFormattedDate')
    const { Header } = await import('../components/Header')

    render(<Header />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Good Morning')
    expect(screen.getByText('Wednesday, December 24, 2025')).toBeInTheDocument()
  })
})
