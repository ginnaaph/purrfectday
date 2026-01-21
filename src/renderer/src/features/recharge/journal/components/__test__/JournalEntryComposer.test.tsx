import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { JournalEntryComposer } from '../layout/JournalEntryComposer'
import { queryClient } from '@/libs/QueryClient'
import { createJournalEntry } from '@/features/recharge/journal/api/createJournalEntry.api'

vi.mock('@/features/recharge/journal/api/createJournalEntry.api', () => ({
  createJournalEntry: vi.fn()
}))

const moodHappy = String.fromCodePoint(0x1f642)
const moodNeutral = String.fromCodePoint(0x1f610)

const renderWithProviders = (ui: React.ReactElement) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)

describe('JournalEntryComposer', () => {
  beforeEach(() => {
    queryClient.clear()
    vi.clearAllMocks()
  })

  it('disables save until content is entered', async () => {
    renderWithProviders(<JournalEntryComposer />)
    const saveButton = screen.getByRole('button', { name: /save entry/i })
    expect(saveButton).toBeDisabled()

    const textarea = screen.getByPlaceholderText("What's on your mind today?")
    await userEvent.type(textarea, 'Hello journal')
    expect(saveButton).toBeEnabled()
  })

  it('submits a journal entry with content, mood, and date', async () => {
    vi.mocked(createJournalEntry).mockResolvedValue({ data: [], error: null })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue(undefined)

    renderWithProviders(<JournalEntryComposer />)
    const textarea = screen.getByPlaceholderText("What's on your mind today?")
    await userEvent.type(textarea, 'Today was a good day.')

    const happyMoodButton = screen.getByRole('button', { name: moodHappy })
    await userEvent.click(happyMoodButton)

    const saveButton = screen.getByRole('button', { name: /save entry/i })
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(createJournalEntry).toHaveBeenCalledTimes(1)
    })

    const callArg = vi.mocked(createJournalEntry).mock.calls[0][0]
    expect(callArg).toMatchObject({
      content: 'Today was a good day.',
      mood: moodHappy
    })
    expect(callArg.entry_date).toBeInstanceOf(Date)

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['journalEntries'] })
    })
  })

  it('clears the form after a successful save', async () => {
    vi.mocked(createJournalEntry).mockResolvedValue({ data: [], error: null })

    renderWithProviders(<JournalEntryComposer />)
    const textarea = screen.getByPlaceholderText("What's on your mind today?")
    await userEvent.type(textarea, 'Reset me')

    const neutralMoodButton = screen.getByRole('button', { name: moodNeutral })
    await userEvent.click(neutralMoodButton)

    const saveButton = screen.getByRole('button', { name: /save entry/i })
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(createJournalEntry).toHaveBeenCalledTimes(1)
    })

    await waitFor(() => {
      expect(textarea).toHaveValue('')
      expect(saveButton).toBeDisabled()
    })
  })
})
