import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { ProjectTabs } from '../ProjectTabs'
import { queryClient } from '@/libs/QueryClient'
import { getAllProjects } from '@/features/productivity/projects/api/getAllProjects.api'
import { insertProject } from '@/features/productivity/projects/api/insertProject.api'

const storeState = vi.hoisted(() => ({
  activeProjectId: null as number | null,
  setActiveProjectId: vi.fn()
}))

vi.mock('@/features/productivity/projects/store/useProjectStore', () => ({
  useProjectStore: (sel: any) => sel(storeState),
  __mocks: { storeState }
}))

vi.mock('@/features/productivity/projects/api/getAllProjects.api', () => ({
  getAllProjects: vi.fn()
}))

vi.mock('@/features/productivity/projects/api/insertProject.api', () => ({
  insertProject: vi.fn()
}))

const renderWithProviders = (ui: React.ReactElement) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)

describe('ProjectTabs', () => {
  beforeEach(() => {
    queryClient.clear()
    vi.clearAllMocks()
    storeState.activeProjectId = null
  })

  it('renders project tabs from the API', async () => {
    vi.mocked(getAllProjects).mockResolvedValue([
      { id: 1, name: 'Wellness', taskCount: 0 },
      { id: 2, name: 'Work', taskCount: 0 }
    ])

    renderWithProviders(<ProjectTabs />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Wellness' })).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'Work' })).toBeInTheDocument()
  })

  it('sets active project when a tab is clicked', async () => {
    vi.mocked(getAllProjects).mockResolvedValue([{ id: 2, name: 'Work', taskCount: 0 }])

    renderWithProviders(<ProjectTabs />)
    const tab = await screen.findByRole('button', { name: 'Work' })
    await userEvent.click(tab)

    expect(storeState.setActiveProjectId).toHaveBeenCalledWith(2)
  })

  it('clears active project when clicking the active tab', async () => {
    storeState.activeProjectId = 1
    vi.mocked(getAllProjects).mockResolvedValue([{ id: 1, name: 'Wellness', taskCount: 0 }])

    renderWithProviders(<ProjectTabs />)
    const tab = await screen.findByRole('button', { name: 'Wellness' })
    await userEvent.click(tab)

    expect(storeState.setActiveProjectId).toHaveBeenCalledWith(null)
  })

  it('creates a project from the modal', async () => {
    vi.mocked(getAllProjects).mockResolvedValue([])
    vi.mocked(insertProject).mockResolvedValue({ id: 3, name: 'Life Admin', taskCount: 0 })

    renderWithProviders(<ProjectTabs />)
    await userEvent.click(screen.getByRole('button', { name: '+ New Project' }))

    const input = await screen.findByPlaceholderText('Project Name')
    await userEvent.type(input, 'Life Admin')
    await userEvent.click(screen.getByRole('button', { name: 'Add Project' }))

    await waitFor(() => {
      expect(insertProject).toHaveBeenCalledWith('Life Admin')
    })
  })
})
