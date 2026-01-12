import Folder from '@/assets/images/icons/folder.png'
import { Trash, PenBoxIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/card/ui/card'
import { Progress } from '@/components/progress/ui/progress'
import { TaskItem } from '@/features/productivity/tasks/components/TaskItem'
import type { Project, Task } from '@/features/productivity/tasks/types'

type ProjectCardGridProps = {
  projects: Project[]
  tasks: Task[]
  onEditProject?: (project: Project) => void
  onDeleteProject?: (project: Project) => void
  onCoinEarned?: (amount: number) => void
}

export const ProjectCardGrid = ({
  projects,
  tasks,
  onEditProject,
  onDeleteProject,
  onCoinEarned
}: ProjectCardGridProps) => {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-secondary-background p-8 text-center">
        <img src={Folder} alt="No projects" className="h-16 w-16 opacity-70" />
        <p className="mt-4 text-lg font-semibold text-primary">No projects yet.</p>
        <p className="text-sm text-text-secondary">Create a project to start grouping tasks.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
      {projects.map((project) => {
        const projectTasks = tasks.filter((task) => task.project_id === project.id)
        const completedCount = projectTasks.filter((task) => task.isComplete).length
        const totalCount = projectTasks.length
        const progressValue = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

        return (
          <Card key={project.id} className="h-full min-h-90 gap-4">
            <CardHeader>
              <div className="flex w-full justify-between gap-3">
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {completedCount} of {totalCount} tasks complete
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Edit ${project.name}`}
                    className="inline-flex items-center justify-center rounded-md p-1 hover:bg-[#f5e8da]"
                    onClick={() => onEditProject?.(project)}
                    disabled={!onEditProject}
                  >
                    <PenBoxIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${project.name}`}
                    className="inline-flex items-center justify-center rounded-md p-1 hover:bg-[#f5e8da]"
                    onClick={() => onDeleteProject?.(project)}
                    disabled={!onDeleteProject}
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="w-full py-3">
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span>Progress</span>
                  <span>{progressValue}%</span>
                </div>
                <Progress value={progressValue} className="h-2 bg-white" />
              </div>
            </CardHeader>

            <CardContent className="flex-1 min-h-0 max-h-64 overflow-y-auto">
              {projectTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3  text-center">
                  <img src={Folder} alt="No tasks" className="h-10 w-10 opacity-70" />
                  <p className="text-sm text-text-secondary">No tasks for this project yet.</p>
                </div>
              ) : (
                <ul>
                  {projectTasks.map((task) => (
                    <TaskItem key={task.id} task={task} onCoinEarned={onCoinEarned} />
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
