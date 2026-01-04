import { create } from 'zustand'
import type { Project } from '@/features/productivity/tasks/types'
import { insertProject } from '@/features/productivity/projects/api/insertProject.api'
export type ProjectStore = {
  projects: Project[]
  activeProjectId: number | null
  setActiveProjectId: (id: number | null) => void
  addProject: (name: string) => Promise<Project | undefined>
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  activeProjectId: null,

  setActiveProjectId: (id) => set({ activeProjectId: id }),

  addProject: async (name: string) => {
    const project = await insertProject(name)
    if (!project) return

    set((state) => ({ projects: [...state.projects, project] }))
    return project
  },
}))

export default useProjectStore
