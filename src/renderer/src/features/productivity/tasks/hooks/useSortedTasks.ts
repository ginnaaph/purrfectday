import { Task } from '../types'

export type SortMethod = '' | 'date' | 'priority' | 'title'

export type SortOptions = '' | SortMethod

export function sortTasks(tasks: Task[], method: SortOptions): Task[] {
  if (!method) return tasks
  const cloned = [...tasks]
  switch (method) {
    case 'date':
      return cloned.sort(
        (a, b) =>
          (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) -
          (b.dueDate ? new Date(b.dueDate).getTime() : Infinity)
      )

    case 'priority': {
      const priorityOrder = { high: 0, medium: 1, low: 2, noPriority: 3 }
      return cloned.sort(
        (a, b) =>
          priorityOrder[a.priority ?? ('noPriority' as keyof typeof priorityOrder)] -
          priorityOrder[b.priority ?? ('noPriority' as keyof typeof priorityOrder)]
      )
    }

    case 'title':
      return cloned.sort((a, b) => a.title.localeCompare(b.title))

    default:
      return tasks
  }
}
