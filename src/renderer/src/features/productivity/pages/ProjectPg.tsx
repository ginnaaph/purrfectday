import { ProjectCardGrid } from '../projects/components/ProjectCardGrid'
import { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getAllProjects } from '../projects/api/getAllProjects.api'
import { getAllTasks } from '../tasks/api/getAllTasks'
import { insertProject } from '../projects/api/insertProject.api'
import { deleteProject } from '../projects/api/deleteProject.api'

export const ProjectPg = () => {
  const [showModal, setShowModal] = useState(false)

  // fetch project list
  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: getAllProjects })
  const projects = useMemo(() => projectsQuery.data ?? [], [projectsQuery.data])
  // Fetch all tasks
  const tasksQuery = useQuery({ queryKey: ['tasks'], queryFn: getAllTasks })
  // Defensive: if tasksQuery.data is an array, use it, else use []
  const tasks = tasksQuery.data?.data ?? []

  // Mutation for adding a new project/list
  const addListMutation = useMutation({
    mutationFn: async (name: string) => {
      await insertProject(name)
    },
    onSuccess: () => {
      projectsQuery.refetch()
    }
  })
  // Mutation for deleting a project/list
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await deleteProject(id)
    },
    onSuccess: () => {
      projectsQuery.refetch()
    }
  })
  return (
    <div className="space-y-6 bg-paleyellow p-6 min-h-full ml-4 mr-4 rounded-xl overflow-y-scroll">
      <div className="bg-off-white text-brown tracking-wider p-4 rounded-xl text-center">
        <h1>Project Manager</h1>
      </div>
      {/* Modal and content start here */}
      <div className="flex gap-2 mb-4  overflow-y-auto">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-1  text-center shadow-sm rounded-full bg-muted-purple text-brown font-lg"
        >
          + New Project
        </button>
      </div>
      {/* AddProjectModal logic (reuse from ProjectTabs) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 z-50 gap-4 py-9 flex justify-center items-center p-3 overflow-y-auto">
          <div className="bg-off-white rounded-lg p-8 shadow-md w-95 mb-4 text-center">
            <div className="flex justify-center w-full px-7 mb-4">
              <h3 className="mb-4 text-[#6a5555] py-3 w-full">Create a New Project</h3>
            </div>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none"
              placeholder="Project Name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = e.currentTarget.value.trim()
                  if (value) {
                    addListMutation.mutate(value)
                    setShowModal(false)
                  }
                }
              }}
            />
            <div className="flex justify-center gap-1">
              <button
                onClick={() => setShowModal(false)}
                className="bg-off-white border-green border text-green  px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.parentElement?.querySelector(
                    'input'
                  ) as HTMLInputElement
                  const value = input?.value.trim()
                  if (value) {
                    addListMutation.mutate(value)
                    setShowModal(false)
                  }
                }}
                className="bg-green text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="overflow-y-auto max-w-full pb-1">
        <ProjectCardGrid
          projects={projects}
          tasks={tasks}
          onDeleteProject={(project) => {
            deleteMutation.mutate(project.id, {
              onSettled: () => setShowModal(false)
            })
          }}
        />
      </div>
    </div>
  )
}
