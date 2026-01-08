import { useMemo } from 'react'
import type { Task } from '../types'
import { useProjectStore } from '../../projects/store/useProjectStore'
import { filterTasksByProject } from '../utiils/filterTaskByActiveProjectId'

export const useFilteredTasks = (tasks: Task[]) => {
  const activeProjectId = useProjectStore((s) => s.activeProjectId)
  const filtered = useMemo(() => filterTasksByProject(tasks, activeProjectId), [tasks, activeProjectId])
  return { tasks: filtered, activeProjectId }
}
