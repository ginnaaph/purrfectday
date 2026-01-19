import { create } from 'zustand'
import type { Goal, GoalTask } from '../types'
import { initialGoals } from '../data/initialGoals'

type GoalsStore = {
  goals: Goal[]
  addGoal: (title: string, description: string, deadline?: string | null) => void
  toggleTask: (goalId: number, taskId: string) => void
  addTask: (goalId: number, task: GoalTask) => void
}

export const useGoalsStore = create<GoalsStore>((set) => ({
  goals: initialGoals,
  addGoal: (title, description, deadline) => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    const next: Goal = {
      id: Date.now(),
      title: trimmedTitle,
      description: description.trim() || 'Describe the outcome you want to achieve.',
      deadline: deadline ?? null,
      tasks: []
    }

    set((state) => ({ goals: [next, ...state.goals] }))
  },
  toggleTask: (goalId, taskId) => {
    set((state) => ({
      goals: state.goals.map((goal) => {
        if (goal.id !== goalId) return goal
        return {
          ...goal,
          tasks: goal.tasks.map((task) =>
            task.id === taskId ? { ...task, isDone: !task.isDone } : task
          )
        }
      })
    }))
  },
  addTask: (goalId, task) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === goalId ? { ...goal, tasks: [...goal.tasks, task] } : goal
      )
    }))
  }
}))
