import { describe, it, expect, vi, afterEach } from 'vitest'
import { getGreeting } from '../getGreeting'

const makeDate = (h: number, m = 0, s = 0) => new Date(2025, 0, 1, h, m, s)

describe('getGreeting', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns Good Morning between 05:00 and 11:59', () => {
    vi.useFakeTimers()
    vi.setSystemTime(makeDate(5, 0))
    expect(getGreeting()).toBe('Good Morning')

    vi.setSystemTime(makeDate(11, 59))
    expect(getGreeting()).toBe('Good Morning')
  })

  it('returns Good Afternoon between 12:00 and 17:59', () => {
    vi.useFakeTimers()
    vi.setSystemTime(makeDate(12, 0))
    expect(getGreeting()).toBe('Good Afternoon')

    vi.setSystemTime(makeDate(17, 59))
    expect(getGreeting()).toBe('Good Afternoon')
  })

  it('returns Good Evening between 18:00 and 21:59', () => {
    vi.useFakeTimers()
    vi.setSystemTime(makeDate(18, 0))
    expect(getGreeting()).toBe('Good Evening')

    vi.setSystemTime(makeDate(21, 59))
    expect(getGreeting()).toBe('Good Evening')
  })

  it('returns Good Night at 22:00–04:59', () => {
    vi.useFakeTimers()
    vi.setSystemTime(makeDate(22, 0))
    expect(getGreeting()).toBe('Good Night')

    vi.setSystemTime(makeDate(4, 59))
    expect(getGreeting()).toBe('Good Night')
  })

  it('handles boundary flips precisely', () => {
    vi.useFakeTimers()
    // 11:59 -> morning
    vi.setSystemTime(makeDate(11, 59))
    expect(getGreeting()).toBe('Good Morning')
    // 12:00 -> afternoon
    vi.setSystemTime(makeDate(12, 0))
    expect(getGreeting()).toBe('Good Afternoon')
    // 17:59 -> afternoon
    vi.setSystemTime(makeDate(17, 59))
    expect(getGreeting()).toBe('Good Afternoon')
    // 18:00 -> evening
    vi.setSystemTime(makeDate(18, 0))
    expect(getGreeting()).toBe('Good Evening')
    // 21:59 -> evening
    vi.setSystemTime(makeDate(21, 59))
    expect(getGreeting()).toBe('Good Evening')
    // 22:00 -> night
    vi.setSystemTime(makeDate(22, 0))
    expect(getGreeting()).toBe('Good Night')
    // 04:59 -> night
    vi.setSystemTime(makeDate(4, 59))
    expect(getGreeting()).toBe('Good Night')
    // 05:00 -> morning
    vi.setSystemTime(makeDate(5, 0))
    expect(getGreeting()).toBe('Good Morning')
  })
})
