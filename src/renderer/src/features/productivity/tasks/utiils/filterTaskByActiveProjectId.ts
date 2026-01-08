import type { Task } from '../types'

export function filterTasksByProject(tasks: Task[], activeProjectId: number | null): Task[] {
  return tasks.filter((task) => {
    if (activeProjectId === null) {
      return true
    } else {
      // Only match if task.project_id is defined and matches
      return task.project_id != null && task.project_id === activeProjectId
    }
  })
}
