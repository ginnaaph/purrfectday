import { describe, it, expect } from 'vitest'
import { formatTime } from '@/utils/dates-time/getFornattedTime'

describe('formatTime', () => {
  it('formats seconds under a minute with leading zero for seconds', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(5)).toBe('0:05')
    expect(formatTime(9)).toBe('0:09')
  })

  it('formats exactly one minute', () => {
    expect(formatTime(60)).toBe('1:00')
  })

  it('formats minutes and seconds correctly', () => {
    expect(formatTime(65)).toBe('1:05')
    expect(formatTime(125)).toBe('2:05')
    expect(formatTime(3599)).toBe('59:59')
  })

  it('handles large durations', () => {
    expect(formatTime(3600)).toBe('60:00')
    expect(formatTime(3661)).toBe('61:01')
  })
})
