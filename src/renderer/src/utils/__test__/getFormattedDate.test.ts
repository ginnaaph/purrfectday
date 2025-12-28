import { describe, it, expect, vi, afterEach } from 'vitest'
import { getFormattedDate, getFormattedDateFromDate } from '../dates-time/getFormattedDate'

// Helper: build a local Date without timezone ambiguity
const d = (y: number, m: number, day: number) => new Date(y, m, day)

describe('getFormattedDateFromDate', () => {
  it('formats a provided Date in en-US long form', () => {
    const date = d(2025, 11, 24) // December is month index 11
    const formatted = getFormattedDateFromDate(date)
    expect(formatted).toBe('Wednesday, December 24, 2025')
  })

  it('handles another known date', () => {
    const date = d(2023, 0, 1) // Jan 1, 2023
    const formatted = getFormattedDateFromDate(date)
    expect(formatted).toBe('Sunday, January 1, 2023')
  })
})

describe('getFormattedDate (current date)', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('formats the current system date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(d(2025, 11, 24))
    const formatted = getFormattedDate()
    expect(formatted).toBe('Wednesday, December 24, 2025')
  })
})
