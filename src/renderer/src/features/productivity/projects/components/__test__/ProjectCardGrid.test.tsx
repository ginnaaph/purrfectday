import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectCardGrid } from '../ProjectCardGrid'
import type { Project, Task } from '@/features/productivity/tasks/types'

vi.mock('@/assets/images/icons/folder.png', () => ({
  default: 'folder.png'
}))

vi.mock('@/features/productivity/tasks/components/TaskItem', () => ({
  TaskItem: ({ task }: { task: Task }) => <li>{task.title}</li>
}))

const baseProject: Project = {
  id: 1,
  name: 'Wellness',
  taskCount: 0
}

describe('ProjectCardGrid', () => {
  it('renders the empty state when there are no projects', () => {
    render(<ProjectCardGrid projects={[]} tasks={[]} />)
    expect(screen.getByText('No projects yet.')).toBeInTheDocument()
  })

  it('renders projects with progress and actions', async () => {
    const onEditProject = vi.fn()
    const onDeleteProject = vi.fn()
    const tasks: Task[] = [
      { id: 1, title: 'Task A', isComplete: true, project_id: 1 },
      { id: 2, title: 'Task B', isComplete: false, project_id: 1 }
    ]

    render(
      <ProjectCardGrid
        projects={[baseProject]}
        tasks={tasks}
        onEditProject={onEditProject}
        onDeleteProject={onDeleteProject}
      />
    )

    expect(screen.getByText('Wellness')).toBeInTheDocument()
    expect(screen.getByText('1 of 2 tasks complete')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Edit Wellness'))
    expect(onEditProject).toHaveBeenCalledWith(baseProject)

    await userEvent.click(screen.getByLabelText('Delete Wellness'))
    expect(onDeleteProject).toHaveBeenCalledWith(baseProject)

    expect(screen.getByText('Task A')).toBeInTheDocument()
    expect(screen.getByText('Task B')).toBeInTheDocument()
  })

  it('shows empty task message when a project has no tasks', () => {
    render(<ProjectCardGrid projects={[baseProject]} tasks={[]} />)
    expect(screen.getByText('No tasks for this project yet.')).toBeInTheDocument()
  })
})
