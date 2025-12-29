import { useQuery } from '@tanstack/react-query'
import { getAllTasks } from '../api/getAllTasks'

export const useLoadTasksIfEmpty = () => {
  const query = useQuery({ queryKey: ['tasks'], queryFn: getAllTasks })
  const tasks = query.data?.data ?? []

  // React Query already fetches and caches tasks; no manual set is needed.
  return { tasks, query }
}
