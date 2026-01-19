import { GoalsView } from '../components/GoalsView'
import { useGoalsController } from '../hooks/useGoalsController'

export const GoalsPgContainer = () => {
  const {
    goals,
    newGoalTitle,
    newGoalDescription,
    newGoalDeadline,
    isCreateOpen,
    openTaskGoalId,
    saveError,
    isSavingTask,
    setNewGoalTitle,
    setNewGoalDescription,
    setNewGoalDeadline,
    openCreate,
    closeCreate,
    addGoal,
    toggleTask,
    openTaskDialog,
    closeTaskDialog,
    addTask
  } = useGoalsController()

  return (
    <GoalsView
      goals={goals}
      newGoalTitle={newGoalTitle}
      newGoalDescription={newGoalDescription}
      newGoalDeadline={newGoalDeadline}
      isCreateOpen={isCreateOpen}
      openTaskGoalId={openTaskGoalId}
      saveError={saveError}
      isSavingTask={isSavingTask}
      onGoalTitleChange={setNewGoalTitle}
      onGoalDescriptionChange={setNewGoalDescription}
      onGoalDeadlineChange={setNewGoalDeadline}
      onOpenCreate={openCreate}
      onCloseCreate={closeCreate}
      onAddGoal={addGoal}
      onToggleTask={toggleTask}
      onOpenTaskDialog={openTaskDialog}
      onCloseTaskDialog={closeTaskDialog}
      onAddTask={addTask}
    />
  )
}
