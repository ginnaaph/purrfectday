import { describe, it, expect, beforeEach } from 'vitest'
import { useGoalsStore } from '../useGoalsStore'
import { initialGoals } from '../../data/initialGoals'
import type { GoalTask } from '../../types'

const resetStore = () => {
  useGoalsStore.setState({
    goals: initialGoals.map((goal) => ({
      ...goal,
      tasks: goal.tasks.map((task) => ({ ...task }))
    }))
  })
}

describe('useGoalsStore', () => {
  beforeEach(() => {
    resetStore()
  })

  it('adds a new goal with default description', () => {
    const { addGoal } = useGoalsStore.getState()
    addGoal('New Goal', '')

    const goals = useGoalsStore.getState().goals
    expect(goals[0].title).toBe('New Goal')
    expect(goals[0].description).toBe('Describe the outcome you want to achieve.')
  })

  it('toggles a task completion state', () => {
    const { toggleTask } = useGoalsStore.getState()
    toggleTask(1, '1a')

    const goal = useGoalsStore.getState().goals.find((item) => item.id === 1)
    const task = goal?.tasks.find((item) => item.id === '1a')
    expect(task?.isDone).toBe(false)
  })

  it('adds a task to a goal', () => {
    const { addTask } = useGoalsStore.getState()
    const newTask: GoalTask = {
      id: '1c',
      title: 'Write launch checklist',
      isDone: false,
      taskId: null
    }

    addTask(1, newTask)

    const goal = useGoalsStore.getState().goals.find((item) => item.id === 1)
    const added = goal?.tasks.find((item) => item.id === '1c')
    expect(added?.title).toBe('Write launch checklist')
  })
})
