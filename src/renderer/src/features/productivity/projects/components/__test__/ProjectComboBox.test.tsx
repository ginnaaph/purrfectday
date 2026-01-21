import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { ProjectComboBox } from '../ProjectComboBox'
import { queryClient } from '@/libs/QueryClient'
import { getAllProjects } from '@/features/productivity/projects/api/getAllProjects.api'
import { insertProject } from '@/features/productivity/projects/api/insertProject.api'

vi.mock('@/features/productivity/projects/api/getAllProjects.api', () => ({
  getAllProjects: vi.fn()
}))

vi.mock('@/features/productivity/projects/api/insertProject.api', () => ({
  insertProject: vi.fn()
}))

const Wrapper = () => {
  const { control } = useForm({ defaultValues: { project: null } })
  return <ProjectComboBox control={control} name="project" />
}

const renderWithProviders = (ui: React.ReactElement) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)

describe('ProjectComboBox', () => {
  beforeEach(() => {
    queryClient.clear()
    vi.clearAllMocks()
  })

  it('selects an existing project', async () => {
    vi.mocked(getAllProjects).mockResolvedValue([
      { id: 1, name: 'Wellness', taskCount: 0 },
      { id: 2, name: 'Work', taskCount: 0 }
    ])

    renderWithProviders(<Wrapper />)

    const combobox = await screen.findByRole('combobox')
    await userEvent.click(combobox)

    await userEvent.click(await screen.findByText('Work'))

    expect(screen.getByRole('combobox')).toHaveTextContent('Work')
  })

  it('creates a new project on enter', async () => {
    vi.mocked(getAllProjects).mockResolvedValue([{ id: 1, name: 'Wellness', taskCount: 0 }])
    vi.mocked(insertProject).mockResolvedValue({ id: 5, name: 'Life Admin', taskCount: 0 })

    renderWithProviders(<Wrapper />)

    const combobox = await screen.findByRole('combobox')
    await userEvent.click(combobox)

    const input = await screen.findByPlaceholderText('Search or create project...')
    await userEvent.type(input, 'Life Admin{enter}')

    await waitFor(() => {
      expect(insertProject).toHaveBeenCalledWith('Life Admin')
    })
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveTextContent('Life Admin')
    })
  })
})
