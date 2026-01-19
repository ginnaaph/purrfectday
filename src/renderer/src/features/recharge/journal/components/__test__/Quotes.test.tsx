import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Quotes from '../Quotes'
import { fetchInspirationalQuotes } from '../../data/InspirationalQuotes'

vi.mock('../../data/InspirationalQuotes', () => ({
  fetchInspirationalQuotes: vi.fn()
}))

describe('Quotes', () => {
  it('renders a quote when the API succeeds', async () => {
    vi.mocked(fetchInspirationalQuotes).mockResolvedValue({
      data: [{ q: 'Keep going.', a: 'Unknown' }],
      error: null
    })

    render(<Quotes />)

    await waitFor(() => {
      expect(screen.getByText('“Keep going.”')).toBeInTheDocument()
    })
    expect(screen.getByText('— Unknown')).toBeInTheDocument()
  })

  it('shows an error message when the API fails', async () => {
    vi.mocked(fetchInspirationalQuotes).mockResolvedValue({
      data: null,
      error: 'HTTP error! status: 500'
    })

    render(<Quotes />)

    await waitFor(() => {
      expect(screen.getByText('HTTP error! status: 500')).toBeInTheDocument()
    })
  })
})
