import { Card, CardContent, CardHeader, CardTitle } from '@/components/card/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/text-area/ui/textArea'
import { Progress } from '@/components/progress/ui/progress'
import { Checkbox } from '@/components/checkbox/ui/checkbox'
import { GoalTaskDialog } from './GoalTaskDialog'
import type { Goal, GoalTaskFormValues } from '../types'

type GoalsViewProps = {
  goals: Goal[]
  newGoalTitle: string
  newGoalDescription: string
  newGoalDeadline: string
  isCreateOpen: boolean
  openTaskGoalId: number | null
  saveError: string | null
  isSavingTask: boolean
  onGoalTitleChange: (value: string) => void
  onGoalDescriptionChange: (value: string) => void
  onGoalDeadlineChange: (value: string) => void
  onOpenCreate: () => void
  onCloseCreate: () => void
  onAddGoal: () => void
  onToggleTask: (goalId: number, taskId: string) => void
  onOpenTaskDialog: (goalId: number) => void
  onCloseTaskDialog: () => void
  onAddTask: (goalId: number, values: GoalTaskFormValues) => Promise<void>
}

export const GoalsView = ({
  goals,
  newGoalTitle,
  newGoalDescription,
  newGoalDeadline,
  isCreateOpen,
  openTaskGoalId,
  saveError,
  isSavingTask,
  onGoalTitleChange,
  onGoalDescriptionChange,
  onGoalDeadlineChange,
  onOpenCreate,
  onCloseCreate,
  onAddGoal,
  onToggleTask,
  onOpenTaskDialog,
  onCloseTaskDialog,
  onAddTask
}: GoalsViewProps) => {
  return (
    <div className="bg-white p-6 min-h-full ml-4 rounded-xl overflow-y-auto">
      <div className="bg-secondary-background text-primary-alt py-2 rounded-xl text-center">
        <h1>Goals</h1>
      </div>

      <div className="mt-4 text-sm text-brown/80">Track your goals here</div>

      <Card className="mt-4 bg-white/80">
        <CardHeader>
          <CardTitle className="text-primary-alt text-2xl">
            Add AI Powered Goal Suggestions
          </CardTitle>
          <div className="text-sm text-primary-alt/60">Coming soon!</div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-primary-alt/70">
            Future AI features will suggest systems and milestones based on your goals.
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-primary-alt text-2xl">Create a new goal</CardTitle>
            {!isCreateOpen && (
              <Button onClick={onOpenCreate} size="sm">
                New Goal
              </Button>
            )}
          </div>
        </CardHeader>
        {isCreateOpen && (
          <CardContent className="flex flex-col gap-3">
            <Input
              placeholder="Goal title (e.g. Finish Purrfect Day launch)"
              value={newGoalTitle}
              onChange={(event) => onGoalTitleChange(event.target.value)}
            />
            <Textarea
              placeholder="Describe what success looks like..."
              value={newGoalDescription}
              onChange={(event) => onGoalDescriptionChange(event.target.value)}
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-primary-alt" htmlFor="goal-deadline">
                Deadline (optional)
              </label>
              <Input
                id="goal-deadline"
                type="date"
                value={newGoalDeadline}
                onChange={(event) => onGoalDeadlineChange(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={onAddGoal}>Add Goal</Button>
              <Button variant="outline" onClick={onCloseCreate}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {saveError && (
        <div className="mt-3 text-sm text-red-600">Failed to create task: {saveError}</div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {goals.map((goal) => {
          const total = goal.tasks.length
          const completed = goal.tasks.filter((task) => task.isDone).length
          const progress = total ? Math.round((completed / total) * 100) : 0

          return (
            <Card key={goal.id} className="bg-white/90">
              <CardHeader className="bg-secondary-background/70 rounded-lg">
                <CardTitle className="text-primary-alt text-xl">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="text-sm text-primary-alt/70">{goal.description}</div>
                <div className="text-sm text-primary-alt/70">
                  Deadline:{' '}
                  <span className="font-semibold text-primary-alt">
                    {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'None'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary-alt/70">Overall Progress</span>
                  <span className="text-primary-alt/80">
                    {completed}/{total} completed
                  </span>
                </div>
                <Progress
                  value={progress}
                  className="h-2.5 bg-primary-alt/10 [&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-[#8fb59b] [&_[data-slot=progress-indicator]]:to-[#c7a5c7] [&_[data-slot=progress-indicator]]:transition-all [&_[data-slot=progress-indicator]]:duration-700 [&_[data-slot=progress-indicator]]:animate-pulse"
                />

                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-primary-alt">Tasks</div>
                    <Button size="sm" onClick={() => onOpenTaskDialog(goal.id)}>
                      Add Task
                    </Button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {goal.tasks.length === 0 && (
                      <div className="text-xs text-primary-alt/60">No tasks yet.</div>
                    )}
                    {goal.tasks.map((task) => (
                      <label
                        key={task.id}
                        className="flex items-center gap-2 rounded-lg bg-primary-alt/10 px-3 py-2 text-sm"
                      >
                        <Checkbox
                          checked={task.isDone}
                          onCheckedChange={() => onToggleTask(goal.id, task.id)}
                        />
                        <span className={task.isDone ? 'line-through opacity-70' : ''}>
                          {task.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <GoalTaskDialog
                  open={openTaskGoalId === goal.id}
                  onOpenChange={(open) => {
                    if (!open) onCloseTaskDialog()
                  }}
                  onSubmit={(values) => onAddTask(goal.id, values)}
                  isSaving={isSavingTask}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export type { GoalsViewProps }
