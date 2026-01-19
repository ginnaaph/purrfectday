import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { Task } from '@/features/productivity/tasks/types'
import { createTask } from '@/features/productivity/tasks/api/createTask'
import { queryClient } from '@/libs/QueryClient'
import type { Goal, GoalTask, GoalTaskFormValues } from '../types'
import { useGoalsStore } from '../store/useGoalsStore'

type GoalsController = {
  goals: Goal[]
  newGoalTitle: string
  newGoalDescription: string
  newGoalDeadline: string
  isCreateOpen: boolean
  openTaskGoalId: number | null
  saveError: string | null
  isSavingTask: boolean
  setNewGoalTitle: (value: string) => void
  setNewGoalDescription: (value: string) => void
  setNewGoalDeadline: (value: string) => void
  openCreate: () => void
  closeCreate: () => void
  addGoal: () => void
  toggleTask: (goalId: number, taskId: string) => void
  openTaskDialog: (goalId: number) => void
  closeTaskDialog: () => void
  addTask: (goalId: number, values: GoalTaskFormValues) => Promise<void>
}

const parseTags = (raw?: string) =>
  (raw ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)

const parseLocalDateInput = (value?: string) => {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

const buildTaskPayload = (goalId: number, values: GoalTaskFormValues): Partial<Task> => {
  const tags = [...parseTags(values.tags), `goal:${goalId}`, 'system']
  const dueDate = parseLocalDateInput(values.dueDate)

  return {
    title: values.title,
    description: values.description ?? undefined,
    priority: values.priority ? (values.priority as Task['priority']) : null,
    tags,
    estimatedPomodoros:
      typeof values.estimatedPomodoros === 'number' ? values.estimatedPomodoros : null,
    project_id: values.project?.value ?? null,
    dueDate: dueDate ?? null,
    isComplete: false
  }
}

export const useGoalsController = (): GoalsController => {
  const goals = useGoalsStore((state) => state.goals)
  const addGoalToStore = useGoalsStore((state) => state.addGoal)
  const toggleTaskInStore = useGoalsStore((state) => state.toggleTask)
  const addTaskToStore = useGoalsStore((state) => state.addTask)

  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [newGoalDescription, setNewGoalDescription] = useState('')
  const [newGoalDeadline, setNewGoalDeadline] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [openTaskGoalId, setOpenTaskGoalId] = useState<number | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const createTaskMutation = useMutation({
    mutationFn: (task: Partial<Task>) => createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const addGoal = () => {
    const deadlineValue = newGoalDeadline.trim() || null
    addGoalToStore(newGoalTitle, newGoalDescription, deadlineValue)
    setNewGoalTitle('')
    setNewGoalDescription('')
    setNewGoalDeadline('')
    setIsCreateOpen(false)
  }

  const toggleTask = (goalId: number, taskId: string) => {
    toggleTaskInStore(goalId, taskId)
  }

  const addTask = async (goalId: number, values: GoalTaskFormValues) => {
    setSaveError(null)
    const title = values.title.trim()
    if (!title) return
    const payload = buildTaskPayload(goalId, { ...values, title })
    const result = await createTaskMutation.mutateAsync(payload)
    if (result.error) {
      setSaveError(result.error.message)
      return
    }

    const taskId = result.data?.[0]?.id ?? null
    const task: GoalTask = {
      id: `${goalId}-${Date.now()}`,
      title,
      description: values.description,
      isDone: false,
      taskId
    }
    addTaskToStore(goalId, task)
  }

  return {
    goals,
    newGoalTitle,
    newGoalDescription,
    newGoalDeadline,
    isCreateOpen,
    openTaskGoalId,
    saveError,
    isSavingTask: createTaskMutation.isPending,
    setNewGoalTitle,
    setNewGoalDescription,
    setNewGoalDeadline,
    openCreate: () => setIsCreateOpen(true),
    closeCreate: () => setIsCreateOpen(false),
    addGoal,
    toggleTask,
    openTaskDialog: (goalId: number) => setOpenTaskGoalId(goalId),
    closeTaskDialog: () => setOpenTaskGoalId(null),
    addTask
  }
}
