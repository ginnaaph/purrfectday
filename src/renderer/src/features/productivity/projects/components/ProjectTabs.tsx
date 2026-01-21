import { useProjectStore } from '../store/useProjectStore'
import { AddProjectModal } from './AddProjecModal'
import { useState, useMemo, useRef } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getAllProjects } from '../api/getAllProjects.api'
import { insertProject } from '../api/insertProject.api'
import { queryClient } from '@/libs/QueryClient'

export const ProjectTabs = () => {
  const query = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects
  })
  const projects = useMemo(() => query.data ?? [], [query.data])
  const activeProjectId = useProjectStore((s) => s.activeProjectId)
  const setActiveProjectId = useProjectStore((s) => s.setActiveProjectId)

  // React Query is source of truth for projects
  const [showModal, setShowModal] = useState(false)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    projectId: number | null
  } | null>(null)
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const contextMenuRef = useRef<HTMLDivElement | null>(null)

  const mutation = useMutation({
    mutationFn: (name: string) => insertProject(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { deleteProject } = await import('../api/deleteProject.api')
      await deleteProject(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })

  return (
    <>
      <div className="flex flex-nowrap gap-1 py-1 overflow-x-auto whitespace-nowrap scroll-smooth w-full max-w-full min-w-0 px-1">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-1 rounded-lg bg-secondary-background/50 text-sm text-center shadow-sm hover:bg-secondary-background/70 transition shrink-0"
        >
          + New Project
        </button>
        {projects.map((project) => (
          <span key={project.id} className="relative shrink-0">
            {editingProjectId === project.id ? (
              <input
                className="px-2 py-1 rounded-lg border text-sm shrink-0"
                value={editName}
                autoFocus
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => setEditingProjectId(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    import('../api/updateProject.api').then(({ updateProject }) => {
                      updateProject(project.id, { name: editName }).then(() => {
                        queryClient.invalidateQueries({ queryKey: ['projects'] })
                        setEditingProjectId(null)
                      })
                    })
                  } else if (e.key === 'Escape') {
                    setEditingProjectId(null)
                  }
                }}
                style={{ width: 90 }}
              />
            ) : (
              <button
                onClick={() => {
                  if (project.id === activeProjectId) {
                    setActiveProjectId(null)
                  } else {
                    setActiveProjectId(project.id)
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault()
                  setContextMenu({ x: e.clientX, y: e.clientY, projectId: project.id })
                  setEditName(project.name)
                }}
                className={`px-4 py-1 rounded-lg shadow-sm transition text-sm ${
                  project.id === activeProjectId
                    ? 'bg-secondary-background font-semibold rounded-lg'
                    : 'bg-white hover:bg-primary-alt/50'
                } shrink-0`}
              >
                {project.name}
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            minWidth: 120
          }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <button
            className="block w-full text-left px-4 py-2 hover:bg-[#f5ebe0]"
            onClick={() => {
              setEditingProjectId(contextMenu.projectId)
              setContextMenu(null)
            }}
          >
            Edit Name
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-red-100"
            onClick={() => {
              if (contextMenu.projectId) {
                const confirmed = window.confirm(
                  'Are you sure you want to delete this project? This cannot be undone.'
                )
                if (confirmed) {
                  deleteMutation.mutate(contextMenu.projectId)
                }
              }
              setContextMenu(null)
            }}
          >
            Delete Project
          </button>
        </div>
      )}

      <AddProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={(newName) => {
          mutation.mutate(newName)
        }}
      />
    </>
  )
}
