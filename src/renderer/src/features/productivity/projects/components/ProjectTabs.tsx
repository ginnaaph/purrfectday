import { useProjectStore } from '../store/useProjectStore'
import { AddProjectModal } from './AddProjecModal'
import { useState, useMemo, useRef, use } from 'react'
import { getAllProjects } from '../api/getAllProjects.api'
import { queryClient } from '@/libs/QueryClient'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Tabs, TabsList, TabsTrigger } from '@/components/tabs/ui/tabs'
import { insertProject } from '../api/insertProject.api'

export const ProjectTabs = () => {
  const query = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects
  })

  const projects = useMemo(() => query.data ?? [], [query.data])
  const activeProjectId = useProjectStore((s) => s.activeProjectId)
  const setActiveProjectId = useProjectStore((s) => s.setActiveProjectId)

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
      <Tabs
        className="overflow-x-auto"
        value={activeProjectId ? activeProjectId.toString() : 'all'}
        onValueChange={(value) => {
          const id = value === 'all' ? null : parseInt(value, 10)
          setActiveProjectId(id)
        }}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {projects.map((project) => (
            <TabsTrigger key={project.id} value={project.id.toString()}>
              {project.name}
            </TabsTrigger>
          ))}
          <TabsTrigger onClick={() => setShowModal(true)} value="add">
            +
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <AddProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={async (name: string) => {
          await mutation.mutateAsync(name)
        }}
      />
    </>
  )
}
