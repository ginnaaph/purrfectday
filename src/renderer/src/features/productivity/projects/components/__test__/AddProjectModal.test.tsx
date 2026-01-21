import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddProjectModal } from '../AddProjecModal'

describe('AddProjectModal', () => {
  it('does not render when closed', () => {
    render(<AddProjectModal isOpen={false} onClose={vi.fn()} onAdd={vi.fn()} />)
    expect(screen.queryByText('Add New Project')).not.toBeInTheDocument()
  })

  it('submits a trimmed name and closes', async () => {
    const onClose = vi.fn()
    const onAdd = vi.fn()

    render(<AddProjectModal isOpen onClose={onClose} onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('Project Name')
    await userEvent.type(input, '  New Project  ')
    await userEvent.click(screen.getByRole('button', { name: 'Add Project' }))

    expect(onAdd).toHaveBeenCalledWith('New Project')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes when cancel is clicked', async () => {
    const onClose = vi.fn()
    render(<AddProjectModal isOpen onClose={onClose} onAdd={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
